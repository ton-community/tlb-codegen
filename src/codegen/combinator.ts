import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression, TypeExpr } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, toCodeArray, TypeWithParameters, ArrowFunctionExpression, tMultiStatement } from './tsgen'
import { TLBMathExpr, TLBVarExpr, TLBNumberExpr, TLBBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { getNegationDerivationFunctionBody, getParamVarExpr, getVarExprByName, simpleCycle, sliceLoad } from './helpers'

type FieldInfoType = {
  typeParamExpr: TypeExpression | undefined
  loadExpr: Expression | undefined
  storeExpr: Statement | undefined
  argLoadExpr: Expression | undefined
  argStoreExpr: Expression | undefined
  paramType: string
  fieldLoadStoreSuffix: string
  negatedVariablesLoads: Array<{name: string, expression: Expression}>
}

export function handleCombinator(expr: ParserExpression, fieldName: string, isField: boolean, needArg: boolean, variableCombinatorName: string, variableSubStructName: string, currentSlice: string, currentCell: string, constructor: TLBConstructor, jsCodeDeclarations: ASTNode[], fieldTypeName: string, argIndex: number, tlbCode: TLBCode, subStructLoadProperties: ObjectProperty[]): FieldInfoType {
  let theSlice = 'slice';
  let theCell = 'builder';
  if (isField) {
    theSlice = currentSlice;
    theCell = currentCell;
  }
  let result: FieldInfoType = { typeParamExpr: undefined, loadExpr: undefined, storeExpr: undefined, argLoadExpr: undefined, argStoreExpr: undefined, paramType: 'number', fieldLoadStoreSuffix: 'Uint', negatedVariablesLoads: [] };

  let insideStoreParameters: Expression[];

  if (isField && !needArg) {
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
          result.argLoadExpr = getParamVarExpr(parameter, constructor);
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
      result.argLoadExpr = convertToAST(myMathExpr, constructor);
      result.argStoreExpr = convertToAST(myMathExpr, constructor, false, tIdentifier(variableSubStructName))
    } else if (expr.name == 'uint' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      let myMathExpr = convertToMathExpr(expr.args[0])
      result.argLoadExpr = convertToAST(myMathExpr, constructor);
      result.argStoreExpr = convertToAST(myMathExpr, constructor, false, tIdentifier(variableSubStructName))
    } else if (expr.name == 'bits' && expr.args.length == 1 && (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)) {
      result.paramType = 'BitString'
      result.fieldLoadStoreSuffix = 'Bits'
      let myMathExpr = convertToMathExpr(expr.args[0])
      result.argLoadExpr = convertToAST(myMathExpr, constructor);
      result.argStoreExpr = convertToAST(myMathExpr, constructor, false, tIdentifier(variableSubStructName))
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
        if (subExprInfo.loadExpr) {
          if (subExprInfo.loadExpr.type == 'FunctionCall') {
            subExprInfo.loadExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [tReturnStatement(subExprInfo.loadExpr)])
          }
          loadFunctionsArray.push(subExprInfo.loadExpr);
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
    if (result.argLoadExpr) {
      result.typeParamExpr = tIdentifier(result.paramType)
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
      result.paramType = subExprInfo.paramType;
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
        result.paramType = subExprInfo.paramType;
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
    // let subExprInfo = handleCombinator(expr.condExpr, fieldName, false, needArg, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, fieldTypeName, argIndex, tlbCode, subStructLoadProperties);
    // result.paramType = subExprInfo.paramType + ' | undefined';
    // result.typeParamExpr = subExprInfo.typeParamExpr
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
    result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(theCell), tIdentifier('store' + result.fieldLoadStoreSuffix)), insideStoreParameters));
  }
  if (result.argLoadExpr != undefined) {
    result.loadExpr = tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + result.fieldLoadStoreSuffix)), [result.argLoadExpr]);
    if (result.paramType == 'Slice') {
      result.loadExpr = tIdentifier(currentSlice)
    }
    result.typeParamExpr = tIdentifier(result.paramType);
  }
  if (result.argStoreExpr != undefined) {
    result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('store' + result.fieldLoadStoreSuffix)), insideStoreParameters));
  }
  if (result.argLoadExpr == undefined && result.argStoreExpr != undefined || result.argLoadExpr != undefined && result.argStoreExpr == undefined) {
    throw new Error('argLoadExpr and argStoreExpr should be both defined or both undefined')
  }
  return result;
}
