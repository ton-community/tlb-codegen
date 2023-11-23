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
    argLoadExpr: Expression | undefined
    argStoreExpr: Expression | undefined
    paramType: string
    fieldLoadStoreSuffix: string
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
    let result: FieldInfoType = {typeParamExpr: undefined, loadExpr: undefined, storeExpr: undefined, argLoadExpr: undefined, argStoreExpr: undefined, paramType: 'number', fieldLoadStoreSuffix: 'Uint'};

    let insideStoreParameters: Expression[];

    if (isField) {
      insideStoreParameters = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(fieldName))];
    } else {
      insideStoreParameters = [tIdentifier('arg')]
    }

    if (expr instanceof BuiltinZeroArgs) {
      if (expr.name == '#') {
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(32);
      }
    } else if (expr instanceof BuiltinOneArgExpr) {
      if (expr.name == '##') {
        if (expr.arg instanceof NumberExpr) {
          result.argLoadExpr = result.argStoreExpr = tNumericLiteral(expr.arg.num);
        }
        if (expr.arg instanceof NameExpr) {
          result.argStoreExpr = tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(expr.arg.name));
          let parameter = constructor.parametersMap.get(expr.arg.name)
          if (parameter) {
            result.argLoadExpr = parameter.expression;
          }
        }
      } else if (expr.name == '#<') {
        if (expr.arg instanceof NumberExpr) {
          result.argLoadExpr = result.argStoreExpr = tNumericLiteral(bitLen(expr.arg.num - 1));
        }
      } else if (expr.name == '#<=') {
        if (expr.arg instanceof NumberExpr) {
          result.argLoadExpr = result.argStoreExpr = tNumericLiteral(bitLen(expr.arg.num));
        } else if (expr.arg instanceof NameExpr) {
          result.argLoadExpr = result.argStoreExpr = tIdentifier(expr.arg.name)
        }
      }
    } else if (expr instanceof CombinatorExpr) {
      if (expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
        if (expr.name == 'int') {
          result.fieldLoadStoreSuffix = 'Int'
          let myMathExpr = convertToMathExpr(expr.args[0])
          result.argLoadExpr = convertToAST(myMathExpr);
          result.argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
        } else if (expr.name == 'uint') {
          let myMathExpr = convertToMathExpr(expr.args[0])
          result.argLoadExpr = convertToAST(myMathExpr);
          result.argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
        } else if (expr.name == 'bits') {
          result.paramType = 'BitString'
          result.fieldLoadStoreSuffix = 'Bits'
          let myMathExpr = convertToMathExpr(expr.args[0])
          result.argLoadExpr = convertToAST(myMathExpr);
          result.argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
        } 
      } 
      if (result.argLoadExpr == undefined) {
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
            }
            storeFunctionsArray.push(subExprInfo.storeExpr);
          }
        });
        result.typeParamExpr = tTypeWithParameters(tIdentifier(expr.name), typeExpression);

        let currentTypeParameters = typeExpression;

        let insideLoadParameters: Array<Expression> = [tIdentifier(theSlice)];

        result.loadExpr = tFunctionCall(tIdentifier('load' + expr.name), insideLoadParameters.concat(loadFunctionsArray), currentTypeParameters);
        result.storeExpr = tFunctionCall(tFunctionCall(tIdentifier('store' + expr.name), insideStoreParameters.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(theCell)])
      } else {
        result.typeParamExpr = tIdentifier(result.paramType);
      }
    } else if (expr instanceof NameExpr) {
      let expName = expr.name;
      if (expName == 'Int') {
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(257);
      }
      if (expName == 'Bits') {
        result.paramType = 'BitString';
        result.fieldLoadStoreSuffix = 'Bits';
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(1023);
      }
      if (expName == 'Bit') {
        result.paramType = 'BitString';
        result.fieldLoadStoreSuffix = 'Bits';
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(1);
      }
      if (expName == 'Uint') {
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(256);
      }
      if (expName == 'Any' || expName == 'Cell') {
        result.paramType = 'Slice'
        result.fieldLoadStoreSuffix = 'Slice'
        result.argLoadExpr = tIdentifier(theSlice);
        result.argStoreExpr = tIdentifier(theSlice);
      }
      let theNum = splitForTypeValue(expName, 'int')
      if (theNum != undefined) {
        result.fieldLoadStoreSuffix = 'Int';
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(theNum);
      }
      theNum = splitForTypeValue(expName, 'uint')
      if (theNum != undefined) {
        result.fieldLoadStoreSuffix = 'Uint';
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(theNum);
      }
      theNum = splitForTypeValue(expName, 'bits')
      if (theNum != undefined) {
        result.fieldLoadStoreSuffix = 'Bits';
        result.paramType = 'BitString';
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(theNum);
      }
      
      if (result.argLoadExpr == undefined) {
        if (constructor.implicitFields.get(expr.name)?.startsWith('#')) {
          result.loadExpr = tIdentifier(expr.name)
        } else {
          result.typeParamExpr = tIdentifier(expr.name);
          if (isField) {
            result.loadExpr = tFunctionCall(tIdentifier('load' + expr.name), [tIdentifier(theSlice)])
            result.storeExpr = tFunctionCall(tFunctionCall(tIdentifier('store' + expr.name), [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(fieldName))]), [tIdentifier(currentCell)])
          } else {
            result.loadExpr = tIdentifier('load' + expr.name)
            result.storeExpr = tIdentifier('store' + expr.name)
          }
        }
      } else {
        result.typeParamExpr = tIdentifier(result.paramType)
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
    }  else {
      result.typeParamExpr = tIdentifier('error');
    }
    if (result.argLoadExpr) {
      result.loadExpr = tFunctionCall(tMemberExpression(tIdentifier(theSlice), tIdentifier('load' + result.fieldLoadStoreSuffix)), [result.argLoadExpr])
    }
    if (result.argStoreExpr) {
      if (result.paramType != 'BitString' && result.paramType != 'Slice') {
        insideStoreParameters.push(result.argStoreExpr);
      }
      result.storeExpr = tFunctionCall(tMemberExpression(tIdentifier(theCell), tIdentifier('store' + result.fieldLoadStoreSuffix)), insideStoreParameters);
    }
    return result;
  }
