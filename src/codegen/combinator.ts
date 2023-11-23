import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression, TypeExpr } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, toCodeArray, TypeWithParameters, ArrowFunctionExpression } from './tsgen'
import { TLBMathExpr, TLBVarExpr, TLBNumberExpr, TLBBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { getNegationDerivationFunctionBody, getParamVarExpr, getVarExprByName } from './helpers'

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
    theCell = currentCell;
  }
  let result: FieldInfoType = { typeParamExpr: undefined, loadExpr: undefined, storeExpr: undefined, argLoadExpr: undefined, argStoreExpr: undefined, paramType: 'number', fieldLoadStoreSuffix: 'Uint' };

  let insideStoreParameters: Expression[];

  if (isField) {
    insideStoreParameters = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(fieldName))];
  } else {
    insideStoreParameters = [tIdentifier('arg')]
  }

  if (expr instanceof BuiltinZeroArgs) {
    if (expr.name == '#') {
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(32);
    } else {
      throw new Error('Expression not supported' + expr)
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
          result.argLoadExpr = getParamVarExpr(parameter);
        }
      } // TODO: handle other cases
    } else if (expr.name == '#<') {
      if (expr.arg instanceof NumberExpr) {
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(bitLen(expr.arg.num - 1));
      } // TODO: handle other cases
    } else if (expr.name == '#<=') {
      if (expr.arg instanceof NumberExpr) {
        result.argLoadExpr = result.argStoreExpr = tNumericLiteral(bitLen(expr.arg.num));
      } else if (expr.arg instanceof NameExpr) {
        result.argLoadExpr = tIdentifier(expr.arg.name)
        result.argStoreExpr = tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(expr.arg.name));
      } // TODO: handle other cases
    }
  } else if (expr instanceof CombinatorExpr) {
    if (expr.name == 'int' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      result.fieldLoadStoreSuffix = 'Int'
      let myMathExpr = convertToMathExpr(expr.args[0])
      result.argLoadExpr = convertToAST(myMathExpr);
      result.argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
    } else if (expr.name == 'uint' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      let myMathExpr = convertToMathExpr(expr.args[0])
      result.argLoadExpr = convertToAST(myMathExpr);
      result.argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
    } else if (expr.name == 'bits' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      result.paramType = 'BitString'
      result.fieldLoadStoreSuffix = 'Bits'
      let myMathExpr = convertToMathExpr(expr.args[0])
      result.argLoadExpr = convertToAST(myMathExpr);
      result.argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
    } else {
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
    } 
    if (result.argLoadExpr) {
      result.typeParamExpr = tIdentifier(result.paramType);
    }
  } else if (expr instanceof NameExpr) {
    let theNum;
    if (expr.name == 'Int') {
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(257);
    } else if (expr.name == 'Bits') {
      result.paramType = 'BitString';
      result.fieldLoadStoreSuffix = 'Bits';
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(1023);
    } else if (expr.name == 'Bit') {
      result.paramType = 'BitString';
      result.fieldLoadStoreSuffix = 'Bits';
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(1);
    } else if (expr.name == 'Uint') {
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(256);
    } else if (expr.name == 'Any' || expr.name == 'Cell') {
      result.paramType = 'Slice'
      result.fieldLoadStoreSuffix = 'Slice'
      result.argLoadExpr = tIdentifier(theSlice);
      result.argStoreExpr = tIdentifier(theSlice);
    } else if ((theNum = splitForTypeValue(expr.name, 'int')) != undefined) {
      result.fieldLoadStoreSuffix = 'Int';
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(theNum);
    } else if ((theNum = splitForTypeValue(expr.name, 'uint')) != undefined) {
      result.fieldLoadStoreSuffix = 'Uint';
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(theNum);
    } else if ((theNum = splitForTypeValue(expr.name, 'bits')) != undefined) {
      result.fieldLoadStoreSuffix = 'Bits';
      result.paramType = 'BitString';
      result.argLoadExpr = result.argStoreExpr = tNumericLiteral(theNum);
    } else {
      if (constructor.variablesMap.get(expr.name)?.type == '#') {
        result.loadExpr = result.storeExpr = getVarExprByName(expr.name, constructor)
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
    }
    if (result.argLoadExpr) {
      result.typeParamExpr = tIdentifier(result.paramType)
    }
  } else if (expr instanceof NumberExpr) {
    result.loadExpr = tNumericLiteral(expr.num)
  } else if (expr instanceof NegateExpr && expr.expr instanceof NameExpr) { // TODO: handle other case
    let getParameterFunctionId = tIdentifier(variableSubStructName + '_get_' + expr.expr.name)
    jsCodeDeclarations.push(tFunctionDeclaration(getParameterFunctionId, tTypeParametersExpression([]), tIdentifier('number'), [tTypedIdentifier(tIdentifier(fieldName), tIdentifier(fieldTypeName))], getNegationDerivationFunctionBody(tlbCode, fieldTypeName, argIndex, fieldName)))
    subStructLoadProperties.push(tObjectProperty(tIdentifier(expr.expr.name), tFunctionCall(getParameterFunctionId, [tIdentifier(fieldName)])))
  } else { // TODO: handle other cases
    throw new Error('Expression not supported: ' + expr);
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
  if (result.argLoadExpr == undefined && result.argStoreExpr != undefined || result.argLoadExpr != undefined && result.argStoreExpr == undefined) {
    throw new Error('argLoadExpr and argStoreExpr should be both defined or both undefined')
  }
  return result;
}
