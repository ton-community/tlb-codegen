import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, toCodeArray, TypeWithParameters, ArrowFunctionExpression } from './tsgen'
import { MyMathExpr, MyVarExpr, MyNumberExpr, MyBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { getNegationDerivationFunctionBody } from './helpers'

type FieldInfoType = {
    typeParamExpr: TypeExpression | undefined
    loadExpr: Expression | undefined
    storeExpr: Expression | undefined
  }

export function handleCombinator(expr: ParserExpression, fieldName: string, isField: boolean, variableCombinatorName: string, variableSubStructName: string, currentSlice: string, currentCell: string, constructor: TLBConstructor, jsCodeDeclarations: ASTNode[], fieldTypeName: string, argIndex: number, tlbCode: TLBCode, subStructLoadProperties: ObjectProperty[]): FieldInfoType {
    let theSlice = 'slice';
    let theCell = 'builder';
    if (isField) {
      theSlice = currentSlice;
    }
    if (isField) {
      theCell = currentCell;
    }
    let result: FieldInfoType = {typeParamExpr: undefined, loadExpr: undefined, storeExpr: undefined};
    let argLoadExpr: Expression | undefined;
    let argStoreExpr: Expression | undefined;

    let fieldType = 'number';
    let fieldLoadStoreSuffix = 'Uint';

    let insideStoreParameters: Expression[];

    if (isField) {
      insideStoreParameters = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(fieldName))];
    } else {
      insideStoreParameters = [tIdentifier('arg')]
    }

    if (expr instanceof CombinatorExpr) {
      if (expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
        if (expr.name == 'int') {
          fieldLoadStoreSuffix = 'Int'
          let myMathExpr = convertToMathExpr(expr.args[0])
          argLoadExpr = convertToAST(myMathExpr);
          argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
        } else if (expr.name == 'uint') {
          let myMathExpr = convertToMathExpr(expr.args[0])
          argLoadExpr = convertToAST(myMathExpr);
          argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
        } else if (expr.name == 'bits') {
          fieldType = 'BitString'
          fieldLoadStoreSuffix = 'Bits'
          let myMathExpr = convertToMathExpr(expr.args[0])
          argLoadExpr = convertToAST(myMathExpr);
          argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
        } 
      } 
      if (argLoadExpr == undefined) {
        let typeExpression: TypeParametersExpression = tTypeParametersExpression([]);
        let loadFunctionsArray: Array<Expression> = []
        let storeFunctionsArray: Array<Expression> = []
        let argIndex = -1;
        expr.args.forEach((arg) => {
          argIndex++;
          let subExprInfo = handleCombinator(arg, fieldName, false, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, fieldTypeName, argIndex, tlbCode, subStructLoadProperties);
          if (subExprInfo.typeParamExpr) {
            typeExpression.typeParameters.push(subExprInfo.typeParamExpr);
          }
          if (subExprInfo.loadExpr) {
            if (subExprInfo.loadExpr.type == 'FunctionCall') {
              subExprInfo.loadExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [tReturnStatement(subExprInfo.loadExpr)])
            }
            loadFunctionsArray.push(subExprInfo.loadExpr);
          }
          if (subExprInfo.storeExpr && subExprInfo.typeParamExpr) {
            if (subExprInfo.storeExpr.type == 'FunctionCall') {
              subExprInfo.storeExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), subExprInfo.typeParamExpr)], [tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], [tExpressionStatement(subExprInfo.storeExpr)]))])
            } else {
              console.log('here')
            }
            storeFunctionsArray.push(subExprInfo.storeExpr);
          }
        });
        result.typeParamExpr = tTypeWithParameters(tIdentifier(expr.name), typeExpression);

        let currentTypeParameters = typeExpression;

        let insideLoadParameters: Array<Expression> = [tIdentifier(theSlice)];

        // subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tTypeWithParameters(tIdentifier(field.expr.name), currentTypeParameters)));
        result.loadExpr = tFunctionCall(tIdentifier('load' + expr.name), insideLoadParameters.concat(loadFunctionsArray), currentTypeParameters);

        // addLoadProperty(field.name, tmpExp, tTypeWithParameters(tIdentifier(tmpTypeName), currentTypeParameters), constructorLoadStatements, subStructLoadProperties);
        result.storeExpr = tFunctionCall(tFunctionCall(tIdentifier('store' + expr.name), insideStoreParameters.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(theCell)])
      } else {
        result.typeParamExpr = tIdentifier(fieldType);
      }
    } else if (expr instanceof NameExpr) {
      let expName = expr.name;
      if (expName == 'Int') {
        argLoadExpr = argStoreExpr = tNumericLiteral(257);
      }
      if (expName == 'Bits') {
        fieldType = 'BitString';
        fieldLoadStoreSuffix = 'Bits';
        argLoadExpr = argStoreExpr = tNumericLiteral(1023);
      }
      if (expName == 'Bit') {
        fieldType = 'BitString';
        fieldLoadStoreSuffix = 'Bits';
        argLoadExpr = argStoreExpr = tNumericLiteral(1);
      }
      if (expName == 'Uint') {
        argLoadExpr = argStoreExpr = tNumericLiteral(256);
      }
      if (expName == 'Any' || expName == 'Cell') {
        fieldType = 'Slice'
        fieldLoadStoreSuffix = 'Slice'
        argLoadExpr = tIdentifier(theSlice);
        argStoreExpr = tIdentifier(theSlice);
      }
      let theNum = splitForTypeValue(expName, 'int')
      if (theNum != undefined) {
        fieldLoadStoreSuffix = 'Int';
        argLoadExpr = argStoreExpr = tNumericLiteral(theNum);
      }
      theNum = splitForTypeValue(expName, 'uint')
      if (theNum != undefined) {
        fieldLoadStoreSuffix = 'Uint';
        argLoadExpr = argStoreExpr = tNumericLiteral(theNum);
      }
      theNum = splitForTypeValue(expName, 'bits')
      if (theNum != undefined) {
        fieldLoadStoreSuffix = 'Bits';
        fieldType = 'BitString';
        argLoadExpr = argStoreExpr = tNumericLiteral(theNum);
      }
      
      if (argLoadExpr == undefined) {
        if (constructor.implicitFields.get(expr.name)?.startsWith('#')) {
          result.loadExpr = tIdentifier(expr.name)
        } else {
          result.typeParamExpr = tIdentifier(expr.name);
          if (isField) {
            result.loadExpr = tFunctionCall(tIdentifier('load' + expr.name), [tIdentifier(theSlice)])
          } else {
            result.loadExpr = tIdentifier('load' + expr.name)
          }
          result.storeExpr = tIdentifier('store' + expr.name)
        }

      //   subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier(field.expr.name)));
      //   addLoadProperty(field.name, tFunctionCall(tIdentifier('load' + field.expr.name), [tIdentifier(currentSlice)]), tIdentifier(field.expr.name), constructorLoadStatements, subStructLoadProperties)
      //   subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + field.expr.name), [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))]), [tIdentifier(currentCell)])))
      } else {
        result.typeParamExpr = tIdentifier(fieldType)
      }
    } else if (expr instanceof NumberExpr) {
      result.loadExpr = tNumericLiteral(expr.num)
    } else if (expr instanceof NegateExpr && expr.expr instanceof NameExpr) {
        let parameter = constructor.parametersMap.get(expr.expr.name)
        if (parameter) {
            let getParameterFunctionId = tIdentifier(variableSubStructName + '_get_' + expr.expr.name)
            jsCodeDeclarations.push(tFunctionDeclaration(getParameterFunctionId, tTypeParametersExpression([]), tIdentifier('number'), [tTypedIdentifier(tIdentifier(fieldName), tIdentifier(fieldTypeName))], getNegationDerivationFunctionBody(tlbCode, fieldTypeName, argIndex, fieldName)))
            subStructLoadProperties.push(tObjectProperty(tIdentifier(expr.expr.name), tFunctionCall(getParameterFunctionId, [tIdentifier(fieldName)])))
        }
      // wasNegated = true;
      // let parameter = constructor.parametersMap.get(element.expr.name)
      // if (parameter) {
        let getParameterFunctionId = tIdentifier(variableSubStructName + '_get_' + expr.expr.name)
        // jsCodeDeclarations.push(tFunctionDeclaration(getParameterFunctionId, tTypeParametersExpression([]), tIdentifier('number'), [tTypedIdentifier(tIdentifier(field.name), tIdentifier(tmpTypeName))], getNegationDerivationFunctionBody(tlbCode, tmpTypeName, argIndex, field.name)))
        // subStructLoadProperties.push(tObjectProperty(tIdentifier(expr.expr.name), tFunctionCall(getParameterFunctionId, [tIdentifier(fieldName)])))
        // result.loadExpr = tFunctionCall(getParameterFunctionId, [tIdentifier(fieldName)]);
      // }
    }  else {
      result.typeParamExpr = tIdentifier('error');
    }
    if (argLoadExpr) {
      result.loadExpr = tFunctionCall(tMemberExpression(tIdentifier(theSlice), tIdentifier('load' + fieldLoadStoreSuffix)), [argLoadExpr])
    }
    if (argStoreExpr) {
      if (fieldType != 'BitString' && fieldType != 'Slice') {
        insideStoreParameters.push(argStoreExpr);
      }
      result.storeExpr = tFunctionCall(tMemberExpression(tIdentifier(theCell), tIdentifier('store' + fieldLoadStoreSuffix)), insideStoreParameters);
    }
    return result;
  }
