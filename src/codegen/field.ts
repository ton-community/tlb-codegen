import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, GenDeclaration, tUnionTypeDeclaration, toCode, toCodeArray, TypeWithParameters, ArrowFunctionExpression, FunctionDeclaration } from './tsgen'
import { MyMathExpr, MyVarExpr, MyNumberExpr, MyBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { constructorNodes } from '../parsing'
import { handleCombinator } from './combinator'
import { addLoadProperty, getNegationDerivationFunctionBody, sliceLoad } from './helpers'

export function handleField(field: FieldDefinition, slicePrefix: Array<number>, tlbCode: TLBCode, constructor: TLBConstructor, constructorLoadStatements: Statement[], subStructStoreStatements: Statement[], subStructProperties: TypedIdentifier[], subStructLoadProperties: ObjectProperty[], variableCombinatorName: string, variableSubStructName: string, jsCodeDeclarations: GenDeclaration[]) {
    let currentSlice = getCurrentSlice(slicePrefix, 'slice');
    let currentCell = getCurrentSlice(slicePrefix, 'cell');

    if (field instanceof FieldAnonymousDef) {
      slicePrefix[slicePrefix.length - 1]++;
      slicePrefix.push(0)

      constructorLoadStatements.push(sliceLoad(slicePrefix, currentSlice))
      subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

      field.fields.forEach(field => {
        handleField(field, slicePrefix, tlbCode, constructor, constructorLoadStatements, subStructStoreStatements, subStructProperties, subStructLoadProperties, variableCombinatorName, variableSubStructName, jsCodeDeclarations)
      });

      subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

      slicePrefix.pop();
    }

    if (field instanceof FieldBuiltinDef && field.type != 'Type') {
      subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier('number')));
      let parameter = constructor.parametersMap.get(field.name)
      if (parameter && !parameter.variable.const && !parameter.variable.negated) {
        subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), parameter.expression))
      }
    }

    if (field instanceof FieldNamedDef) {

      let argLoadExpr: Expression | undefined;
      let argStoreExpr: Expression | undefined;

      if (field.expr instanceof BuiltinZeroArgs) {
        if (field.expr.name == '#') {
          argLoadExpr = argStoreExpr = tNumericLiteral(32);
        }
      }
      if (field.expr instanceof BuiltinOneArgExpr) {
        if (field.expr.name == '##') {
          if (field.expr.arg instanceof NumberExpr) {
            argLoadExpr = argStoreExpr = tNumericLiteral(field.expr.arg.num);
          }
          if (field.expr.arg instanceof NameExpr) {
            argStoreExpr = tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.expr.arg.name));
            let parameter = constructor.parametersMap.get(field.expr.arg.name)
            if (parameter) {
              argLoadExpr = parameter.expression;
            }
          }
        }
        if (field.expr.name == '#<') {
          if (field.expr.arg instanceof NumberExpr) {
            argLoadExpr = argStoreExpr = tNumericLiteral(bitLen(field.expr.arg.num - 1));
          }
        }
        if (field.expr.name == '#<=') {
          if (field.expr.arg instanceof NumberExpr) {
            argLoadExpr = argStoreExpr = tNumericLiteral(bitLen(field.expr.arg.num));
          }
        }
      }

      if (field.expr instanceof CellRefExpr) {
        slicePrefix[slicePrefix.length - 1]++;
        slicePrefix.push(0)

        constructorLoadStatements.push(sliceLoad(slicePrefix, currentSlice))

        subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

        handleField(new FieldNamedDef(field.name, field.expr.expr), slicePrefix, tlbCode, constructor, constructorLoadStatements, subStructStoreStatements, subStructProperties, subStructLoadProperties, variableCombinatorName, variableSubStructName, jsCodeDeclarations)

        subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

        slicePrefix.pop();
      }


      let fieldType = 'number';
      let fieldLoadStoreSuffix = 'Uint';

      
      if (field.expr instanceof CombinatorExpr) {
        let fieldInfo = handleCombinator(field.expr, field.name, true, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor);
        if (fieldInfo.typeParamExpr) {
          console.log('param', toCode(fieldInfo.typeParamExpr, { tabs: 0 }))
        }
        // if (fieldInfo.loadExpr) {
        //   console.log('load', toCode(fieldInfo.loadExpr, {tabs: 0}))
        // }
        if (fieldInfo.storeExpr) {
          console.log('store', toCode(fieldInfo.storeExpr, {tabs: 0}))
        }
        let storeFunctionsArray: Array<Expression> = []
        let wasNegated = false;

        if (field.expr.args.length > 0 && (field.expr.args[0] instanceof MathExpr || field.expr.args[0] instanceof NumberExpr || field.expr.args[0] instanceof NameExpr)) {
          if (field.expr.name == 'int') {
            fieldLoadStoreSuffix = 'Int'
            let myMathExpr = convertToMathExpr(field.expr.args[0])
            argLoadExpr = convertToAST(myMathExpr);
            argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
          }
          if (field.expr.name == 'uint') {
            let myMathExpr = convertToMathExpr(field.expr.args[0])
            argLoadExpr = convertToAST(myMathExpr);
            argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
          }
          if (field.expr.name == 'bits') {
            fieldType = 'BitString'
            fieldLoadStoreSuffix = 'Bits'
            let myMathExpr = convertToMathExpr(field.expr.args[0])
            argLoadExpr = convertToAST(myMathExpr);
            argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
          }
        }

        let tmpTypeName = field.expr.name;

        if (argLoadExpr == undefined) {
          let argIndex = -1;
          field.expr.args.forEach(element => {
            argIndex++;
            if (element instanceof NameExpr) {
              if (constructor.implicitFields.get(element.name)?.startsWith('#')) {
              } else {
                storeFunctionsArray.push(tIdentifier('store' + element.name))
              }
            }
            if (element instanceof NumberExpr) {
            }
            if (element instanceof NegateExpr && element.expr instanceof NameExpr) {
              wasNegated = true;
              let parameter = constructor.parametersMap.get(element.expr.name)
              if (parameter) {
                let getParameterFunctionId = tIdentifier(variableSubStructName + '_get_' + element.expr.name)
                jsCodeDeclarations.push(tFunctionDeclaration(getParameterFunctionId, tTypeParametersExpression([]), tIdentifier('number'), [tTypedIdentifier(tIdentifier(field.name), tIdentifier(tmpTypeName))], getNegationDerivationFunctionBody(tlbCode, tmpTypeName, argIndex, field.name)))
                subStructLoadProperties.push(tObjectProperty(tIdentifier(element.expr.name), tFunctionCall(getParameterFunctionId, [tIdentifier(field.name)])))
              }
            }
            if (element instanceof CombinatorExpr) {
              let theFieldType = 'number'
              let theFieldLoadStoreName = 'Uint';
              let theBitsLoad: Expression = tIdentifier('');
              let theBitsStore: Expression = tIdentifier('');
              if (element.args.length > 0 && (element.args[0] instanceof MathExpr || element.args[0] instanceof NumberExpr || element.args[0] instanceof NameExpr)) {
                // (slice: Slice) => {return slice.loadUint(22);}
                if (element.name == 'int') {
                  theFieldLoadStoreName = 'Int'
                  let myMathExpr = convertToMathExpr(element.args[0])
                  theBitsLoad = convertToAST(myMathExpr);
                  theBitsStore = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                }
                if (element.name == 'uint') {
                  let myMathExpr = convertToMathExpr(element.args[0])
                  theBitsLoad = convertToAST(myMathExpr);
                  theBitsStore = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                }
                if (element.name == 'bits') {
                  theFieldType = 'BitString'
                  theFieldLoadStoreName = 'Bits'
                  let myMathExpr = convertToMathExpr(element.args[0])
                  theBitsLoad = convertToAST(myMathExpr);
                  theBitsStore = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                }
              }
              // here
              //(arg: number) => {return (builder: Builder) => {builder.storeUint(arg, 22);}}
              storeFunctionsArray.push(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), tIdentifier(theFieldType))], [tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('store' + theFieldLoadStoreName)), [tIdentifier('arg'), theBitsStore]))]))]))
            }
          });

          let currentTypeParameters = tTypeParametersExpression([]);
          if (fieldInfo.typeParamExpr && fieldInfo.typeParamExpr.type == 'TypeWithParameters') {
            currentTypeParameters = fieldInfo.typeParamExpr.typeParameters;
          } else {
            throw new Error('program bug1')
          }
          subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tTypeWithParameters(tIdentifier(field.expr.name), currentTypeParameters)));
          
          if (fieldInfo.loadExpr) {
            addLoadProperty(field.name, fieldInfo.loadExpr, tTypeWithParameters(tIdentifier(tmpTypeName), currentTypeParameters), constructorLoadStatements, subStructLoadProperties);
          } else {
            throw new Error('program bug2')
          }
          if (fieldInfo.storeExpr) {
            subStructStoreStatements.push(tExpressionStatement(fieldInfo.storeExpr))
          } else {
            throw new Error('program bug3')
          }
        }
      }
      if (field.expr instanceof NameExpr) {
        let expName = field.expr.name;
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
          argLoadExpr = tIdentifier(currentSlice);
          argStoreExpr = tIdentifier(currentSlice);
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
          subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier(field.expr.name)));
          addLoadProperty(field.name, tFunctionCall(tIdentifier('load' + field.expr.name), [tIdentifier(currentSlice)]), tIdentifier(field.expr.name), constructorLoadStatements, subStructLoadProperties)
          subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + field.expr.name), [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))]), [tIdentifier(currentCell)])))
        }
      }
      if (argLoadExpr != undefined && argStoreExpr != undefined) {
        let loadSt: Expression = tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + fieldLoadStoreSuffix)), [argLoadExpr]);
        if (fieldType == 'Slice') {
          loadSt = tIdentifier(currentSlice)
        }
        addLoadProperty(field.name, loadSt, tIdentifier(fieldType), constructorLoadStatements, subStructLoadProperties)
        subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier(fieldType)))
        let storeParams: Expression[] = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))];
        if (fieldType != 'BitString' && fieldType != 'Slice') {
          storeParams.push(argStoreExpr);
        }
        subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('store' + fieldLoadStoreSuffix)), storeParams)))
      }
    }
  }