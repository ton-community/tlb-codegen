import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression, TypeExpr } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, toCodeArray, TypeWithParameters, ArrowFunctionExpression, tMultiStatement, tUnionTypeExpression, tTernaryExpression } from './tsgen'
import { TLBMathExpr, TLBVarExpr, TLBNumberExpr, TLBBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { getNegationDerivationFunctionBody, getParamVarExpr, getVarExprByName, simpleCycle, sliceLoad } from './helpers'

type FieldInfoType = {
  typeParamExpr: TypeExpression | undefined
  loadExpr: Expression | undefined
  loadFunctionExpr: Expression | undefined
  storeExpr: Statement | undefined
  negatedVariablesLoads: Array<{name: string, expression: Expression}>
}

type ExprForParam = {
  argLoadExpr: Expression
  argStoreExpr: Expression
  paramType: string
  fieldLoadStoreSuffix: string
}

export function handleCombinator(expr: ParserExpression, fieldName: string, isField: boolean, needArg: boolean, variableCombinatorName: string, variableSubStructName: string, currentSlice: string, currentCell: string, constructor: TLBConstructor, jsCodeDeclarations: ASTNode[], fieldTypeName: string, argIndex: number, tlbCode: TLBCode, subStructLoadProperties: ObjectProperty[]): FieldInfoType {
  let theSlice = 'slice';
  let theCell = 'builder';
  if (isField) {
    theSlice = currentSlice;
    theCell = currentCell;
  }
  let result: FieldInfoType = { typeParamExpr: undefined, loadExpr: undefined, loadFunctionExpr: undefined, storeExpr: undefined, negatedVariablesLoads: [] };

  let exprForParam: ExprForParam | undefined;

  let insideStoreParameters: Expression[];

  if (isField && !needArg) {
    insideStoreParameters = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(fieldName))];
  } else {
    insideStoreParameters = [tIdentifier('arg')]
  }

  if (expr instanceof BuiltinZeroArgs) {
    if (expr.name == '#') {
      exprForParam = {argLoadExpr: tNumericLiteral(32), argStoreExpr: tNumericLiteral(32), paramType: 'number', fieldLoadStoreSuffix: 'Uint'}
    } else {
      throw new Error('Expression not supported' + expr)
    }
  } else if (expr instanceof BuiltinOneArgExpr) {
    if (expr.name == '##') {
      if (expr.arg instanceof NumberExpr) {
        exprForParam = {argLoadExpr: tNumericLiteral(expr.arg.num), argStoreExpr: tNumericLiteral(expr.arg.num), paramType: 'number', fieldLoadStoreSuffix: 'Uint'}
      }
      if (expr.arg instanceof NameExpr) {
        let parameter = constructor.parametersMap.get(expr.arg.name)
        if (!parameter) {
          throw new Error('')
        }
        exprForParam = {
          argLoadExpr: getParamVarExpr(parameter, constructor), 
          argStoreExpr: tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(expr.arg.name)), 
          paramType: 'number', fieldLoadStoreSuffix: 'Uint'
        }
      } // TODO: handle other cases
    } else if (expr.name == '#<') {
      if (expr.arg instanceof NumberExpr || expr.arg instanceof NameExpr) {
        exprForParam = {
          argLoadExpr: tFunctionCall(tIdentifier('bitLen'), [tBinaryExpression(convertToAST(convertToMathExpr(expr.arg), constructor, true), '-', tNumericLiteral(1))]), 
          argStoreExpr: tFunctionCall(tIdentifier('bitLen'), [tBinaryExpression(convertToAST(convertToMathExpr(expr.arg), constructor, true, tIdentifier(variableCombinatorName)), '-', tNumericLiteral(1))]), 
          paramType: 'number', fieldLoadStoreSuffix: 'Uint'
        }
      } // TODO: handle other cases
    } else if (expr.name == '#<=') {
      if (expr.arg instanceof NumberExpr || expr.arg instanceof NameExpr) {
        exprForParam = {
          argLoadExpr: tFunctionCall(tIdentifier('bitLen'), [convertToAST(convertToMathExpr(expr.arg), constructor, true)]), 
          argStoreExpr: tFunctionCall(tIdentifier('bitLen'), [convertToAST(convertToMathExpr(expr.arg), constructor, true, tIdentifier(variableCombinatorName))]), 
          paramType: 'number', fieldLoadStoreSuffix: 'Uint'
        }
      } // TODO: handle other cases
    } 
  } else if (expr instanceof CombinatorExpr) {
    if (expr.name == 'int' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      let myMathExpr = convertToMathExpr(expr.args[0])
      exprForParam = {
        argLoadExpr: convertToAST(myMathExpr, constructor),
        argStoreExpr: convertToAST(myMathExpr, constructor, false, tIdentifier(variableSubStructName)),
        paramType: 'number', fieldLoadStoreSuffix: 'Int'
      }
    } else if (expr.name == 'uint' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      let myMathExpr = convertToMathExpr(expr.args[0])
      exprForParam = {
        argLoadExpr: convertToAST(myMathExpr, constructor),
        argStoreExpr: convertToAST(myMathExpr, constructor, false, tIdentifier(variableSubStructName)),
        paramType: 'number', fieldLoadStoreSuffix: 'Uint'
      }
    } else if (expr.name == 'bits' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      let myMathExpr = convertToMathExpr(expr.args[0])
      exprForParam = {
        argLoadExpr: convertToAST(myMathExpr, constructor),
        argStoreExpr: convertToAST(myMathExpr, constructor, false, tIdentifier(variableSubStructName)),
        paramType: 'BitString', fieldLoadStoreSuffix: 'Bits'
      }
    } else {
      let typeExpression: TypeParametersExpression = tTypeParametersExpression([]);
      let loadFunctionsArray: Array<Expression> = []
      let storeFunctionsArray: Array<Expression> = []
      let argIndex = -1;
      expr.args.forEach((arg) => {
        argIndex++;
        let subExprInfo = handleCombinator(arg, fieldName, false, needArg, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, fieldTypeName, argIndex, tlbCode, subStructLoadProperties);
        if (subExprInfo.typeParamExpr) {
          typeExpression.typeParameters.push(subExprInfo.typeParamExpr);
        }
        if (subExprInfo.loadFunctionExpr) {
          loadFunctionsArray.push(subExprInfo.loadFunctionExpr);
        }
        if (subExprInfo.storeExpr && subExprInfo.typeParamExpr) {
            if (subExprInfo.storeExpr.type == 'ExpressionStatement' && subExprInfo.storeExpr.expression.type == 'FunctionCall' || subExprInfo.storeExpr.type == 'MultiStatement') {
              subExprInfo.storeExpr = tExpressionStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), subExprInfo.typeParamExpr)], [tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], [subExprInfo.storeExpr]))]))
            }
            if (subExprInfo.storeExpr.type == 'ExpressionStatement') {
              storeFunctionsArray.push(subExprInfo.storeExpr.expression); 
            }
        }
        result.negatedVariablesLoads = result.negatedVariablesLoads.concat(subExprInfo.negatedVariablesLoads);
      });
      result.typeParamExpr = tTypeWithParameters(tIdentifier(expr.name), typeExpression);

      let currentTypeParameters = typeExpression;

      let insideLoadParameters: Array<Expression> = [tIdentifier(theSlice)];

      result.loadExpr = tFunctionCall(tIdentifier('load' + expr.name), insideLoadParameters.concat(loadFunctionsArray), currentTypeParameters);
      result.storeExpr = tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + expr.name), insideStoreParameters.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(theCell)]))
    } 
    if (exprForParam) {
      result.typeParamExpr = tIdentifier(exprForParam.paramType);
    }
  } else if (expr instanceof NameExpr) {
    let theNum;
    if (expr.name == 'Int') {
      exprForParam = {argLoadExpr: tNumericLiteral(257), argStoreExpr: tNumericLiteral(257), paramType: 'number', fieldLoadStoreSuffix: 'Int'}
    } else if (expr.name == 'Bits') {
      exprForParam = {argLoadExpr: tNumericLiteral(1023), argStoreExpr: tNumericLiteral(1023), paramType: 'BitString', fieldLoadStoreSuffix: 'Bits'}
    } else if (expr.name == 'Bit') {
      exprForParam = {argLoadExpr: tNumericLiteral(1), argStoreExpr: tNumericLiteral(1), paramType: 'BitString', fieldLoadStoreSuffix: 'Bits'}
    } else if (expr.name == 'Uint') {
      exprForParam = {argLoadExpr: tNumericLiteral(256), argStoreExpr: tNumericLiteral(256), paramType: 'number', fieldLoadStoreSuffix: 'Uint'}
    } else if (expr.name == 'Any' || expr.name == 'Cell') {
      exprForParam = {argLoadExpr: tIdentifier(theSlice), argStoreExpr: tIdentifier(theSlice), paramType: 'Slice', fieldLoadStoreSuffix: 'Slice'}
    } else if ((theNum = splitForTypeValue(expr.name, 'int')) != undefined) {
      exprForParam = {argLoadExpr: tNumericLiteral(theNum), argStoreExpr: tNumericLiteral(theNum), paramType: 'number', fieldLoadStoreSuffix: 'Int'}
    } else if ((theNum = splitForTypeValue(expr.name, 'uint')) != undefined) {
      exprForParam = {argLoadExpr: tNumericLiteral(theNum), argStoreExpr: tNumericLiteral(theNum), paramType: 'number', fieldLoadStoreSuffix: 'Uint'}
    } else if ((theNum = splitForTypeValue(expr.name, 'bits')) != undefined) {
      exprForParam = {argLoadExpr: tNumericLiteral(theNum), argStoreExpr: tNumericLiteral(theNum), paramType: 'BitString', fieldLoadStoreSuffix: 'Bits'}
    } else {
      if (constructor.variablesMap.get(expr.name)?.type == '#') {
        result.loadExpr = getVarExprByName(expr.name, constructor)
        result.storeExpr = tExpressionStatement(result.loadExpr);
      } else {
        result.typeParamExpr = tIdentifier(expr.name);
        if (isField) {
          result.loadExpr = tFunctionCall(tIdentifier('load' + expr.name), [tIdentifier(theSlice)])
          result.storeExpr = tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + expr.name), insideStoreParameters), [tIdentifier(currentCell)]))
        } else {
          result.loadExpr = tIdentifier('load' + expr.name)
          result.storeExpr = tExpressionStatement(tIdentifier('store' + expr.name))
        }
      }
    }
    if (exprForParam) {
      result.typeParamExpr = tIdentifier(exprForParam.paramType)
    }
  } else if (expr instanceof NumberExpr) {
    result.loadExpr = tNumericLiteral(expr.num)
  } else if (expr instanceof NegateExpr && expr.expr instanceof NameExpr) { // TODO: handle other case
    let getParameterFunctionId = tIdentifier(variableSubStructName + '_get_' + expr.expr.name)
    jsCodeDeclarations.push(tFunctionDeclaration(getParameterFunctionId, tTypeParametersExpression([]), tIdentifier('number'), [tTypedIdentifier(tIdentifier(fieldName), tIdentifier(fieldTypeName))], getNegationDerivationFunctionBody(tlbCode, fieldTypeName, argIndex, fieldName)))
    result.negatedVariablesLoads.push({name: expr.expr.name, expression: tFunctionCall(getParameterFunctionId, [tIdentifier(fieldName)])})
  } else if (expr instanceof CellRefExpr) {
    let currentSlice = getCurrentSlice([1, 0], 'slice');
    let currentCell = getCurrentSlice([1, 0], 'cell');

    let subExprInfo = handleCombinator(expr.expr, fieldName, true, true, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, fieldTypeName, argIndex, tlbCode, subStructLoadProperties);
    if (subExprInfo.loadExpr) {
      result.typeParamExpr = subExprInfo.typeParamExpr;
      result.storeExpr = subExprInfo.storeExpr;
      result.negatedVariablesLoads = subExprInfo.negatedVariablesLoads;
      result.loadExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [sliceLoad([1, 0], 'slice'), tReturnStatement(subExprInfo.loadExpr)])
    }
    if (subExprInfo.storeExpr) {
      result.storeExpr = tMultiStatement([
        tExpressionStatement(tDeclareVariable(tIdentifier(currentCell), tFunctionCall(tIdentifier('beginCell'), []))),
        subExprInfo.storeExpr,
        tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeRef')), [tIdentifier(currentCell)]))
      ])
    }
  } else if (expr instanceof MathExpr) {
    if (fieldTypeName == '') {
      if (expr.op == '*') {
        let arrayLength = convertToAST(convertToMathExpr(expr.left), constructor, true);
        let subExprInfo = handleCombinator(expr.right, fieldName, false, needArg, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, fieldTypeName, argIndex, tlbCode, subStructLoadProperties);
        let currentParam = insideStoreParameters[0]
        if (subExprInfo.loadExpr) {
          result.loadExpr = tFunctionCall(tMemberExpression(tFunctionCall(tMemberExpression(tIdentifier('Array'), tIdentifier('from')), [tFunctionCall(tMemberExpression(tFunctionCall(tIdentifier('Array'), [arrayLength]), tIdentifier('keys')), [])]), tIdentifier('map')), [tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), tIdentifier('number'))], [tReturnStatement(subExprInfo.loadExpr)])])
        }
        if (currentParam && subExprInfo.typeParamExpr && subExprInfo.storeExpr) {
          result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(currentParam, tIdentifier('forEach')), [tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), subExprInfo.typeParamExpr)], [subExprInfo.storeExpr])])) //subExprInfo.storeExpr;
        }
        if (subExprInfo.typeParamExpr) {
          result.typeParamExpr = tTypeWithParameters(tIdentifier('Array'), tTypeParametersExpression([subExprInfo.typeParamExpr]));
        }
      } else {
        throw new Error('')
      }
    } else {
      result.loadExpr = convertToAST(convertToMathExpr(expr), constructor, true);
      result.storeExpr = tExpressionStatement(result.loadExpr);
    }
  } else if (expr instanceof CondExpr) {
    let subExprInfo = handleCombinator(expr.condExpr, fieldName, true, false, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, fieldTypeName, argIndex, tlbCode, subStructLoadProperties);
    if (subExprInfo.typeParamExpr) {
      result.typeParamExpr = tUnionTypeExpression([subExprInfo.typeParamExpr, tIdentifier('undefined')])
    }
    if (subExprInfo.loadExpr) {
      let conditionExpr: Expression;
      if (expr.left instanceof NameExpr) {
        conditionExpr = convertToAST(convertToMathExpr(expr.left), constructor, true)
        if (expr.dotExpr != null) {
          conditionExpr = tBinaryExpression(conditionExpr, '&', tBinaryExpression(tNumericLiteral(1), '<<', tNumericLiteral(expr.dotExpr)))
        }
      } else { // TODO: handle other cases
        throw new Error('')
      }
      result.loadExpr = tTernaryExpression(conditionExpr, subExprInfo.loadExpr, tIdentifier('undefined'))
    }
    let currentParam = insideStoreParameters[0]
    if (currentParam && subExprInfo.storeExpr) {
      result.storeExpr = tIfStatement(tBinaryExpression(currentParam, '!=', tIdentifier('undefined')), [subExprInfo.storeExpr])
    }
  } else { // TODO: handle other cases
    throw new Error('Expression not supported: ' + expr);
  }
  if (exprForParam) {
    result.loadExpr = tFunctionCall(tMemberExpression(tIdentifier(theSlice), tIdentifier('load' + exprForParam.fieldLoadStoreSuffix)), [exprForParam.argLoadExpr])
    if (exprForParam.paramType != 'BitString' && exprForParam.paramType != 'Slice') {
      insideStoreParameters.push(exprForParam.argStoreExpr);
    }
    result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(theCell), tIdentifier('store' + exprForParam.fieldLoadStoreSuffix)), insideStoreParameters));
  }
  if (exprForParam != undefined) {
    result.loadExpr = tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + exprForParam.fieldLoadStoreSuffix)), [exprForParam.argLoadExpr]);
    if (exprForParam.paramType == 'Slice') {
      result.loadExpr = tIdentifier(currentSlice)
      result.loadFunctionExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [tReturnStatement(tIdentifier('slice'))])
    }
    result.typeParamExpr = tIdentifier(exprForParam.paramType);
    result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('store' + exprForParam.fieldLoadStoreSuffix)), insideStoreParameters));
  }

  if (result.loadExpr && !result.loadFunctionExpr) {
    if (result.loadExpr.type == 'FunctionCall') {
      result.loadFunctionExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [tReturnStatement(result.loadExpr)])
    } else {
      result.loadFunctionExpr = result.loadExpr
    }
  }


  return result;
}
