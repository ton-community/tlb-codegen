import { BuiltinZeroArgs, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, toCodeArray } from './tsgen'
import { MyMathExpr, MyVarExpr, MyNumberExpr, MyBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue } from './util'

function getSubStructName(tlbType: TLBType, constructor: TLBConstructor): string {
  if (tlbType.constructors.length > 1) {
    return tlbType.name + '_' + constructor.declaration.constructorDef.name;
  } else {
    return tlbType.name;
  }
}

function getNegationDerivationFunctionBody(tlbCode: TLBCode, typeName: string, parameterIndex: number, parameterName: string): Statement[] {
  let result: Statement[] = [];
  let tlbType: TLBType | undefined = tlbCode.types.get(typeName);
  tlbType?.constructors.forEach(constructor => {
    if (tlbType != undefined) {
      let getExpression: Expression;
      if (constructor.parameters[parameterIndex]?.variable.const) {
        getExpression = tNumericLiteral(constructor.parameters.)
      } else {

      }
      result.push(tIfStatement(tBinaryExpression(tMemberExpression(tIdentifier(parameterName), tIdentifier('kind')), '==', tStringLiteral(getSubStructName(tlbType, constructor))), []))
    }
  });
  result.push(tExpressionStatement(tIdentifier("throw new Error('')")))

  return result;
}

export function generate(tree: Program) {
    let jsCodeDeclarations = []
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Builder'), tStringLiteral('ton'))) // importDeclaration([importSpecifier(identifier('Builder'), identifier('Builder'))], stringLiteral('../boc/Builder')))
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Slice'), tStringLiteral('ton')))  // importDeclaration([importSpecifier(identifier('Slice'), identifier('Slice'))], stringLiteral('../boc/Slice')))
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('beginCell'), tStringLiteral('ton')))
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('BitString'), tStringLiteral('ton')))


    let tlbCode: TLBCode = {types: new Map<string, TLBType>()}

    fillConstructors(tree.declarations, tlbCode);

    tlbCode.types.forEach((tlbType: TLBType, combinatorName: string) => {
        let variableCombinatorName = combinatorName.charAt(0).toLowerCase() + combinatorName.slice(1)
        if (combinatorName == undefined) {
          return;
        }
        let subStructsUnion: TypeExpression[] = []
        let subStructDeclarations: ASTNode[]  = []

        let loadStatements: Statement[] = []
        let storeStatements: Statement[] = []

        let structTypeParametersExpr: TypeParametersExpression = tTypeParametersExpression([]);

        tlbType.constructors.forEach(constructor => {
          let variablesDeclared = new Set<string>;          

          let constructorLoadStatements: Statement[] = []
          let declaration = constructor.declaration;
          let subStructName: string = getSubStructName(tlbType, constructor);
          
          let variableSubStructName = firstLower(subStructName)
    
          let subStructProperties: TypedIdentifier[] = [tTypedIdentifier(tIdentifier('kind'), tStringLiteral(subStructName))]
          let subStructLoadProperties: ObjectProperty[] = [tObjectProperty(tIdentifier('kind'), tStringLiteral(subStructName))]
          let subStructStoreStatements: Statement[] = []    
          
          let tag = declaration?.constructorDef.tag;
          if (tag == undefined) {
            return;
          }
          if (tag[0] == '$') {

          }
          let tagBitLen = tag?.length - 1;
          let tagBinary = '0b' + tag.slice(1);

          if (structTypeParametersExpr.typeParameters.length == 0) {
            structTypeParametersExpr = getTypeParametersExpression(constructor.parameters);
          }

          let slicePrefix: number[] = [0];

          function handleField(field: FieldDefinition) {
            let currentSlice = getCurrentSlice(slicePrefix, 'slice');
            let currentCell = getCurrentSlice(slicePrefix, 'cell');

            if (field instanceof FieldAnonymousDef) {
              slicePrefix[slicePrefix.length - 1]++;  
              slicePrefix.push(0)
   
              constructorLoadStatements.push(
                tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'slice')), 
                  tFunctionCall(tMemberExpression(
                    tFunctionCall(tMemberExpression(
                      tIdentifier(currentSlice), tIdentifier('loadRef')
                    ), []),
                    tIdentifier('beginParse')
                  ), []), )))

              subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

              field.fields.forEach(element => {
                handleField(element);
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
                    let parameter = constructor.parametersMap.get(field.name)
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
    
                constructorLoadStatements.push(
                  tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'slice')), 
                    tFunctionCall(tMemberExpression(
                      tFunctionCall(tMemberExpression(
                        tIdentifier(currentSlice), tIdentifier('loadRef')
                      ), []),
                      tIdentifier('beginParse')
                    ), []), )))

                subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

                handleField(new FieldNamedDef(field.name, field.expr.expr))

                subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

                slicePrefix.pop();              
              }


              let fieldType = 'number';
              let fieldLoadStoreSuffix = 'Uint';

              if (field.expr instanceof CombinatorExpr) {
                let typeParameterArray: Array<Identifier> = []
                let loadFunctionsArray: Array<Expression> = []
                let storeFunctionsArray: Array<Expression> = []
                let wasNegated = false;

                if (field.expr.args.length > 0 && (field.expr.args[0] instanceof MathExpr || field.expr.args[0] instanceof NumberExpr ||  field.expr.args[0] instanceof NameExpr)) {
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
                        loadFunctionsArray.push(tIdentifier(element.name))
                      } else {
                        typeParameterArray.push(tIdentifier(element.name))
                        loadFunctionsArray.push(tIdentifier('load' + element.name))
                        storeFunctionsArray.push(tIdentifier('store' + element.name))
                      }
                    }
                    if (element instanceof NumberExpr) {
                      loadFunctionsArray.push(tNumericLiteral(element.num))
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
                      if (element.args.length > 0 && (element.args[0] instanceof MathExpr || element.args[0] instanceof NumberExpr ||  element.args[0] instanceof NameExpr)) {
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
                        typeParameterArray.push(tIdentifier(theFieldType))
                      }
                      // here
                      loadFunctionsArray.push(tArrowFunctionExpression([], [tReturnStatement(tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + theFieldLoadStoreName)), [theBitsLoad]))]))
                      //(arg: number) => {return (builder: Builder) => {builder.storeUint(arg, 22);}}
                      storeFunctionsArray.push(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), tIdentifier(theFieldType))], [tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('store' + theFieldLoadStoreName)), [tIdentifier('arg'), theBitsStore]))]))]))
                    }
                  });
  
                  let currentTypeParameters = tTypeParametersExpression(typeParameterArray);
  
                  let insideLoadParameters: Array<Expression> = [tIdentifier(currentSlice)];
                  let insideStoreParameters: Array<Expression> = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))];
  
                  subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tTypeWithParameters(tIdentifier(field.expr.name), currentTypeParameters)));
                  let tmpExp = tFunctionCall(tIdentifier('load' + field.expr.name), insideLoadParameters.concat(loadFunctionsArray), currentTypeParameters);
                  if (!wasNegated) {
                    subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tmpExp)) 
                  } else {
                    constructorLoadStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(field.name), tmpExp, tIdentifier(tmpTypeName))))
                    subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tIdentifier(field.name))) 
                  }
                  subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + field.expr.name), insideStoreParameters.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(currentCell)])))   
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
                  subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tFunctionCall(tIdentifier('load' + field.expr.name), [tIdentifier(currentSlice)]))) 
                  subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + field.expr.name), [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))]), [tIdentifier(currentCell)])))   
                }
              }
              if (argLoadExpr != undefined && argStoreExpr != undefined) {
                let loadSt: Expression = tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + fieldLoadStoreSuffix)), [argLoadExpr]);
                if (fieldType == 'Slice') {
                  loadSt = tIdentifier(currentSlice)
                }
                if (!variablesDeclared.has(field.name)) {
                  variablesDeclared.add(field.name);
                  constructorLoadStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(field.name), undefined, tIdentifier(fieldType))))
                }
                constructorLoadStatements.push(tExpressionStatement(tBinaryExpression(tIdentifier(field.name), '=', loadSt)))
                subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier(fieldType))) 
                subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tIdentifier(field.name))) 
                let storeParams: Expression[] = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))];
                if (fieldType != 'BitString' && fieldType != 'Slice') {
                  storeParams.push(argStoreExpr);
                }
                subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('store' + fieldLoadStoreSuffix)), storeParams)))   
              }
            }
          }

          declaration?.fields.forEach(element => { handleField(element); })

          subStructsUnion.push(tTypeWithParameters(tIdentifier(subStructName), structTypeParametersExpr));
          
          let structX = tStructDeclaration(tIdentifier(subStructName), subStructProperties, structTypeParametersExpr);

          constructorLoadStatements.push(tReturnStatement(tObjectExpression(subStructLoadProperties)));
          if (tlbType.constructors.length > 1) {
            let conditions: Array<BinaryExpression> = []
            if (tagBinary[tagBinary.length - 1] != '_') {
              conditions.push(tBinaryExpression(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('preloadUint')), [tNumericLiteral(tagBitLen)]), '==', tIdentifier(tagBinary)))
            }
            constructor.parameters.forEach(element => {
              if (element.variable.const) {
                conditions.push(tBinaryExpression(tIdentifier(element.variable.name), '==', element.expression))
              }
            });
            loadStatements.push(tIfStatement(getCondition(conditions), constructorLoadStatements))
          } else {
            loadStatements = loadStatements.concat(constructorLoadStatements);
          }

          if (tlbType.constructors.length > 1 && tagBinary[tagBinary.length - 1] != '_') {
            let preStoreStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeUint')), [tIdentifier(tagBinary), tNumericLiteral(tagBitLen)]))];
            subStructStoreStatements = preStoreStatement.concat(subStructStoreStatements)
          }
          let storeStatement: Statement = tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], subStructStoreStatements));
          if (tlbType.constructors.length > 1) {
            storeStatement = tIfStatement(tBinaryExpression(tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier('kind')), '==', tStringLiteral(subStructName)), [storeStatement])
          }
          storeStatements.push(storeStatement);

          subStructDeclarations.push(structX)
        });


        // loadTheType: (slice: Slice) => TheType

        if (tlbType.constructors.length > 1) {
          loadStatements.push(tExpressionStatement(tIdentifier("throw new Error('')")))
          storeStatements.push(tExpressionStatement(tIdentifier("throw new Error('')")))
        }

        let loadFunctionParameters = [tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))]
        let storeFunctionParameters = [tTypedIdentifier(tIdentifier(variableCombinatorName), tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr))]

        let anyConstructor = tlbType.constructors[0];
        if (anyConstructor) {
          anyConstructor.parameters.forEach(element => {
            if (element.variable.type == 'Type') {
              loadFunctionParameters.push(tTypedIdentifier(tIdentifier('load' + element.variable.name), tArrowFunctionType([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], tIdentifier(element.variable.name))))

              storeFunctionParameters.push(
                tTypedIdentifier(tIdentifier('store' + element.variable.name), 
                tArrowFunctionType(
                  [tTypedIdentifier(tIdentifier(firstLower(element.variable.name)), tIdentifier(element.variable.name))], 
                  tArrowFunctionType([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], tIdentifier('void')))))
            }
            if (element.variable.type == '#' && !element.variable.negated) {
              loadFunctionParameters.push(tTypedIdentifier(tIdentifier(element.variable.name), tIdentifier('number')))
            }
          });
        }

        let loadFunction = tFunctionDeclaration(tIdentifier('load' + combinatorName), structTypeParametersExpr, tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr), loadFunctionParameters, loadStatements);

        let storeFunction = tFunctionDeclaration(tIdentifier('store' + combinatorName), structTypeParametersExpr, tIdentifier('(builder: Builder) => void'), storeFunctionParameters, storeStatements) 

        if (tlbType.constructors.length > 1) {
          let unionTypeDecl = tUnionTypeDeclaration(tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr), subStructsUnion)
          jsCodeDeclarations.push(unionTypeDecl)
        }
        subStructDeclarations.forEach(element => {
          jsCodeDeclarations.push(element)
        });

        jsCodeDeclarations.push(loadFunction)
        jsCodeDeclarations.push(storeFunction)
    });

    let generatedCode = ''
    
    jsCodeDeclarations.forEach(element => {
      generatedCode += toCode(element, {tabs: 0}) + '\n';
    });
    return generatedCode;
}