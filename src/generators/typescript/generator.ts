import { TLBCode, TLBConstructor, TLBField, TLBFieldType, TLBType } from "../../ast";
import { firstLower, getCurrentSlice, getSubStructName, goodVariableName } from "../../utils";
import { CodeBuilder } from "../CodeBuilder";
import { CodeGenerator } from "../generator";
import { BinaryExpression, Expression, GenDeclaration, ObjectProperty, Statement, StructDeclaration, TheNode, TypeExpression, TypeParametersExpression, TypedIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tComment, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIdentifier, tIfStatement, tImportDeclaration, tMemberExpression, tMultiStatement, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTernaryExpression, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnaryOpExpression, tUnionTypeDeclaration, tUnionTypeExpression, toCode } from "./tsgen";
import { ExprForParam, FieldInfoType, addLoadProperty, convertToAST, getCondition, getNegationDerivationFunctionBody, getParamVarExpr, getTypeParametersExpression, isBigInt, sliceLoad } from "./utils";


type ConstructorContext = {
    constructor: TLBConstructor
    constructorLoadStatements: Statement[]
    constructorStoreStatements: Statement[]
    constructorProperties: TypedIdentifier[]
    constructorLoadProperties: ObjectProperty[]
    variableCombinatorName: string
    variableSubStructName: string
}

export class TypescriptGenerator implements CodeGenerator {
    jsCodeDeclarations: GenDeclaration[] = []
    jsCodeConstructorDeclarations: GenDeclaration[] = []
    jsCodeFunctionsDeclarations: GenDeclaration[] = []
    tlbCode: TLBCode

    constructor(tlbCode: TLBCode) {
        this.tlbCode = tlbCode
    }

    addTonCoreClassUsage(name: string) {
        this.jsCodeDeclarations.push(tImportDeclaration(tIdentifier(name), tStringLiteral('ton')))
    }
    addBitLenFunction() {
        this.jsCodeDeclarations.push(tFunctionDeclaration(tIdentifier('bitLen'), tTypeParametersExpression([]), null, [tTypedIdentifier(tIdentifier('n'), tIdentifier('number'))], [
            tExpressionStatement(tIdentifier('return n.toString(2).length;'))
        ]))
    }
    addTlbType(tlbType: TLBType): void {
        let variableCombinatorName = goodVariableName(firstLower(tlbType.name), '0')
        let typeUnion: TypeExpression[] = []
        let constructorsDeclarations: StructDeclaration[] = []

        let loadStatements: Statement[] = []
        let storeStatements: Statement[] = []

        let structTypeParametersExpr: TypeParametersExpression = tTypeParametersExpression([]);

        tlbType.constructors.forEach(constructor => {
            let constructorTypeName: string = getSubStructName(tlbType, constructor);

            let ctx: ConstructorContext = {
                constructor: constructor,
                variableSubStructName: goodVariableName(firstLower(constructorTypeName), '_' + constructor.name),
                variableCombinatorName: variableCombinatorName,
                constructorLoadStatements: [],
                constructorLoadProperties: [tObjectProperty(tIdentifier('kind'), tStringLiteral(constructorTypeName))],
                constructorProperties: [tTypedIdentifier(tIdentifier('kind'), tStringLiteral(constructorTypeName))],
                constructorStoreStatements: []
            }

            structTypeParametersExpr = getTypeParametersExpression(constructor.parameters);

            let slicePrefix: number[] = [0];

            constructor.variables.forEach((variable) => {
                if (variable.negated) {
                    if (variable.deriveExpr) {
                        ctx.constructorLoadProperties.push(tObjectProperty(tIdentifier(variable.name), convertToAST(variable.deriveExpr, constructor)));
                    }
                }
            })

            constructor.variables.forEach(variable => {
                if (variable.type == '#' && !variable.isField) {
                    ctx.constructorProperties.push(tTypedIdentifier(tIdentifier(variable.name), tIdentifier('number')));
                    let parameter = constructor.parametersMap.get(variable.name)
                    if (parameter && !parameter.variable.isConst && !parameter.variable.negated) {
                        ctx.constructorLoadProperties.push(tObjectProperty(tIdentifier(variable.name), getParamVarExpr(parameter, constructor)))
                    }
                }
            })

            constructor.fields.forEach(field => {
                this.handleField(field, slicePrefix, ctx);
            })

            typeUnion.push(tTypeWithParameters(tIdentifier(constructorTypeName), structTypeParametersExpr));

            let structX = tStructDeclaration(tIdentifier(constructorTypeName), ctx.constructorProperties, structTypeParametersExpr);

            constructor.constraints.forEach(constraint => {
                let loadConstraintAST = convertToAST(constraint, constructor);
                let storeConstraintAST = convertToAST(constraint, constructor, tIdentifier(variableCombinatorName));
                let exceptionCommentLastPart = ` is not satisfied while loading "${getSubStructName(tlbType, constructor)}" for type "${tlbType.name}"`
                ctx.constructorLoadStatements.push(tIfStatement(tUnaryOpExpression('!', loadConstraintAST), [tExpressionStatement(tIdentifier("throw new Error('Condition " + toCode(loadConstraintAST).code + exceptionCommentLastPart + "')"))]));
                ctx.constructorStoreStatements.push(tIfStatement(tUnaryOpExpression('!', storeConstraintAST), [tExpressionStatement(tIdentifier("throw new Error('Condition " + toCode(storeConstraintAST).code + exceptionCommentLastPart + "')"))]))
            });

            ctx.constructorLoadStatements.push(tReturnStatement(tObjectExpression(ctx.constructorLoadProperties)));
            if (constructor.tag.bitLen != 0 || tlbType.constructors.length > 1) {
                let conditions: Array<BinaryExpression> = []
                if (constructor.tag.bitLen != 0) {
                    conditions.push(tBinaryExpression(tMemberExpression(tIdentifier('slice'), tIdentifier('remainingBits')), '>=', tNumericLiteral(constructor.tag.bitLen)))
                    conditions.push(tBinaryExpression(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('preloadUint')), [tNumericLiteral(constructor.tag.bitLen)]), '==', tIdentifier(constructor.tag.binary)))
                    let loadBitsStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('loadUint')), [tNumericLiteral(constructor.tag.bitLen)]))]
                    ctx.constructorLoadStatements = loadBitsStatement.concat(ctx.constructorLoadStatements);
                }
                constructor.parameters.forEach(param => {
                    if (param.variable.isConst && !param.variable.negated) {
                        let argName = param.variable.name;
                        if (param.argName) {
                            argName = param.argName
                        }
                        conditions.push(tBinaryExpression(tIdentifier(argName), '==', getParamVarExpr(param, constructor)))
                    }
                });
                loadStatements.push(tIfStatement(getCondition(conditions), ctx.constructorLoadStatements))
            } else {
                loadStatements = loadStatements.concat(ctx.constructorLoadStatements);
            }

            if (constructor.tag.bitLen != 0) {
                let preStoreStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeUint')), [tIdentifier(constructor.tag.binary), tNumericLiteral(constructor.tag.bitLen)]))];
                ctx.constructorStoreStatements = preStoreStatement.concat(ctx.constructorStoreStatements)
            }
            let storeStatement: Statement = tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], ctx.constructorStoreStatements));
            if (tlbType.constructors.length > 1) {
                storeStatement = tIfStatement(tBinaryExpression(tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier('kind')), '==', tStringLiteral(constructorTypeName)), [storeStatement])
            }
            storeStatements.push(storeStatement);

            constructorsDeclarations.push(structX)

            this.jsCodeFunctionsDeclarations.push(tComment(constructor.declaration))

        });


        // loadTheType: (slice: Slice) => TheType

        let exceptionTypesComment = tlbType.constructors.map(constructor => { return `"${getSubStructName(tlbType, constructor)}"` }).join(', ')
        let exceptionComment = tExpressionStatement(tIdentifier("throw new Error('" + `Expected one of ${exceptionTypesComment} in loading "${tlbType.name}", but data does not satisfy any constructor` + "')"))
        if (tlbType.constructors.length > 1 || tlbType.constructors.at(0)?.tag.bitLen != 0) {
            let neededTypesComment = '';
            tlbType.constructors.forEach(constructor => {
                neededTypesComment += getSubStructName(tlbType, constructor)
            })
            loadStatements.push(exceptionComment)
        }
        if (tlbType.constructors.length > 1) {
            storeStatements.push(exceptionComment)
        }

        let loadFunctionParameters = [tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))]
        let storeFunctionParameters = [tTypedIdentifier(tIdentifier(variableCombinatorName), tTypeWithParameters(tIdentifier(tlbType.name), structTypeParametersExpr))]

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
                    if (element.argName) {
                        loadFunctionParameters.push(tTypedIdentifier(tIdentifier(element.argName), tIdentifier('number')))
                    } else {
                        loadFunctionParameters.push(tTypedIdentifier(tIdentifier(element.variable.name), tIdentifier('number')))
                    }
                }
            });
        } else {
            throw new Error(`Type ${tlbType.name} should have at least one constructor`)
        }

        let loadFunction = tFunctionDeclaration(tIdentifier('load' + tlbType.name), structTypeParametersExpr, tTypeWithParameters(tIdentifier(tlbType.name), structTypeParametersExpr), loadFunctionParameters, loadStatements);

        let storeFunction = tFunctionDeclaration(tIdentifier('store' + tlbType.name), structTypeParametersExpr, tIdentifier('(builder: Builder) => void'), storeFunctionParameters, storeStatements)

        if (tlbType.constructors.length > 1) {
            let unionTypeDecl = tUnionTypeDeclaration(tTypeWithParameters(tIdentifier(tlbType.name), structTypeParametersExpr), tUnionTypeExpression(typeUnion))
            this.jsCodeConstructorDeclarations.push(unionTypeDecl)
        }
        constructorsDeclarations.forEach(element => {
            this.jsCodeConstructorDeclarations.push(element)
        });

        this.jsCodeFunctionsDeclarations.push(loadFunction)
        this.jsCodeFunctionsDeclarations.push(storeFunction)
    }

    toCode(node: TheNode, code: CodeBuilder = new CodeBuilder()): CodeBuilder {
        return toCode(node, code);
    }

    handleField(field: TLBField, slicePrefix: Array<number>, ctx: ConstructorContext) {
        let currentSlice = getCurrentSlice(slicePrefix, 'slice');
        let currentCell = getCurrentSlice(slicePrefix, 'cell');

        if (field.subFields.length > 0) {
            slicePrefix[slicePrefix.length - 1]++;
            slicePrefix.push(0)

            ctx.constructorLoadStatements.push(sliceLoad(slicePrefix, currentSlice))
            ctx.constructorStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

            field.subFields.forEach(fieldDef => {
                this.handleField(fieldDef, slicePrefix, ctx)
            });

            ctx.constructorStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

            slicePrefix.pop();
        }

        if (field.fieldType.kind == 'TLBExoticType') {
            slicePrefix[slicePrefix.length - 1]++;
            slicePrefix.push(0);
            ctx.constructorLoadStatements.push(
                tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')),
                    tFunctionCall(tMemberExpression(
                        tIdentifier(currentSlice), tIdentifier('loadRef')
                    ), []),)))
            addLoadProperty(field.name, tIdentifier(getCurrentSlice(slicePrefix, 'cell')), undefined, ctx.constructorLoadStatements, ctx.constructorLoadProperties)
            ctx.constructorProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier('Cell')));
            ctx.constructorStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tMemberExpression(tIdentifier(ctx.variableCombinatorName), tIdentifier(field.name))])))
            slicePrefix.pop();
        } else if (field.subFields.length == 0) {
            if (field == undefined) {
                throw new Error('')
            }
            let fieldInfo = this.handleType(field, field.fieldType, true, ctx, slicePrefix, 0);
            if (fieldInfo.loadExpr) {
                addLoadProperty(field.name, fieldInfo.loadExpr, fieldInfo.typeParamExpr, ctx.constructorLoadStatements, ctx.constructorLoadProperties);
            }
            if (fieldInfo.typeParamExpr) {
                ctx.constructorProperties.push(tTypedIdentifier(tIdentifier(field.name), fieldInfo.typeParamExpr));
            }
            if (fieldInfo.storeExpr) {
                ctx.constructorStoreStatements.push(fieldInfo.storeExpr)
            }
            fieldInfo.negatedVariablesLoads.forEach(element => {
                addLoadProperty(element.name, element.expression, undefined, ctx.constructorLoadStatements, ctx.constructorLoadProperties)
            });
        }
    }


    handleType(field: TLBField, fieldType: TLBFieldType, isField: boolean, ctx: ConstructorContext, slicePrefix: Array<number>, argIndex: number): FieldInfoType {
        let currentSlice = getCurrentSlice(slicePrefix, 'slice');
        let currentCell = getCurrentSlice(slicePrefix, 'cell');

        let fieldName = field.name
        let theSlice = 'slice';
        let theCell = 'builder';
        if (isField) {
            theSlice = currentSlice;
            theCell = currentCell;
        }
        let result: FieldInfoType = { typeParamExpr: undefined, loadExpr: undefined, loadFunctionExpr: undefined, storeExpr: undefined, storeExpr2: undefined, storeFunctionExpr: undefined, negatedVariablesLoads: [] };

        let exprForParam: ExprForParam | undefined;

        let storeExpr2: Statement | undefined;

        let insideStoreParameters: Expression[];

        insideStoreParameters = [tMemberExpression(tIdentifier(ctx.variableCombinatorName), tIdentifier(fieldName))]; // TODO: use only field
        let insideStoreParameters2: Expression[] = [tIdentifier('arg')]

        if (fieldType.kind == 'TLBNumberType') {
            exprForParam = {
                argLoadExpr: convertToAST(fieldType.bits, ctx.constructor),
                argStoreExpr: convertToAST(fieldType.storeBits, ctx.constructor, tIdentifier(ctx.variableCombinatorName)),
                paramType: 'number',
                fieldLoadSuffix: fieldType.signed ? 'Int' : 'Uint',
                fieldStoreSuffix: fieldType.signed ? 'Int' : 'Uint'
            }
            if (isBigInt(fieldType)) {
                exprForParam.fieldLoadSuffix += 'Big';
                exprForParam.paramType = 'bigint';
            }
        } else if (fieldType.kind == 'TLBBitsType') {
            exprForParam = {
                argLoadExpr: convertToAST(fieldType.bits, ctx.constructor),
                argStoreExpr: convertToAST(fieldType.bits, ctx.constructor, tIdentifier(ctx.variableSubStructName)),
                paramType: 'BitString', fieldLoadSuffix: 'Bits', fieldStoreSuffix: 'Bits'
            }
        } else if (fieldType.kind == 'TLBCellType') {
            exprForParam = { argLoadExpr: tIdentifier(theSlice), argStoreExpr: tIdentifier(theSlice), paramType: 'Slice', fieldLoadSuffix: 'Slice', fieldStoreSuffix: 'Slice' }
        } else if (fieldType.kind == 'TLBBoolType') {
            exprForParam = { argLoadExpr: undefined, argStoreExpr: undefined, paramType: 'boolean', fieldLoadSuffix: 'Boolean', fieldStoreSuffix: 'Bit' }
        } else if (fieldType.kind == 'TLBAddressType') {
            exprForParam = { argLoadExpr: undefined, argStoreExpr: undefined, paramType: 'Address', fieldLoadSuffix: 'Address', fieldStoreSuffix: 'Address' }
        } else if (fieldType.kind == 'TLBExprMathType') {
            result.loadExpr = convertToAST(fieldType.expr, ctx.constructor);
            result.storeExpr = tExpressionStatement(result.loadExpr)
        } else if (fieldType.kind == 'TLBNegatedType') {
            let getParameterFunctionId = tIdentifier(ctx.variableSubStructName + '_get_' + fieldType.variableName)
            if (field.fieldType.kind == 'TLBNamedType') {
                let fieldTypeName = field.fieldType.name
                this.jsCodeFunctionsDeclarations.push(tFunctionDeclaration(getParameterFunctionId, tTypeParametersExpression([]), tIdentifier('number'), [tTypedIdentifier(tIdentifier(goodVariableName(fieldName)), tIdentifier(fieldTypeName))], getNegationDerivationFunctionBody(this.tlbCode, fieldTypeName, argIndex, fieldName)))
            }
            result.negatedVariablesLoads.push({ name: fieldType.variableName, expression: tFunctionCall(getParameterFunctionId, [tIdentifier(fieldName)]) })
        } else if (fieldType.kind == 'TLBNamedType' && fieldType.arguments.length == 0) {
            let typeName = fieldType.name;
            result.typeParamExpr = tIdentifier(typeName);
            if (isField) {
                result.loadExpr = tFunctionCall(tIdentifier('load' + typeName), [tIdentifier(theSlice)])
                result.storeExpr = tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + typeName), insideStoreParameters), [tIdentifier(currentCell)]))
                storeExpr2 = tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + typeName), insideStoreParameters2), [tIdentifier(currentCell)]))
            } else {
                result.loadExpr = tIdentifier('load' + typeName)
                result.storeExpr = tExpressionStatement(tIdentifier('store' + typeName))
            }
        } else if (fieldType.kind == 'TLBCondType') {
            let subExprInfo: FieldInfoType
            let conditionExpr: Expression;
            subExprInfo = this.handleType(field, fieldType.value, true, ctx, slicePrefix, argIndex);
            conditionExpr = convertToAST(fieldType.condition, ctx.constructor)
            if (subExprInfo.typeParamExpr) {
                result.typeParamExpr = tUnionTypeExpression([subExprInfo.typeParamExpr, tIdentifier('undefined')])
            }
            if (subExprInfo.loadExpr) {
                result.loadExpr = tTernaryExpression(conditionExpr, subExprInfo.loadExpr, tIdentifier('undefined'))
            }
            let currentParam = insideStoreParameters[0]
            let currentParam2 = insideStoreParameters2[0]
            if (currentParam && currentParam2 && subExprInfo.storeExpr) {
                result.storeExpr = tIfStatement(tBinaryExpression(currentParam, '!=', tIdentifier('undefined')), [subExprInfo.storeExpr])
                storeExpr2 = tIfStatement(tBinaryExpression(currentParam2, '!=', tIdentifier('undefined')), [subExprInfo.storeExpr])
            }
        } else if (fieldType.kind == 'TLBMultipleType') {
            let arrayLength: Expression
            let subExprInfo: FieldInfoType
            arrayLength = convertToAST(fieldType.times, ctx.constructor);
            subExprInfo = this.handleType(field, fieldType.value, false, ctx, slicePrefix, argIndex);
            let currentParam = insideStoreParameters[0]
            let currentParam2 = insideStoreParameters2[0]
            if (subExprInfo.loadExpr) {
                result.loadExpr = tFunctionCall(tMemberExpression(tFunctionCall(tMemberExpression(tIdentifier('Array'), tIdentifier('from')), [tFunctionCall(tMemberExpression(tFunctionCall(tIdentifier('Array'), [arrayLength]), tIdentifier('keys')), [])]), tIdentifier('map')), [tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), tIdentifier('number'))], [tReturnStatement(subExprInfo.loadExpr)])])
            }
            if (currentParam && currentParam2 && subExprInfo.typeParamExpr && subExprInfo.storeExpr) {
                if (subExprInfo.storeFunctionExpr && subExprInfo.storeExpr2) {
                    result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(currentParam, tIdentifier('forEach')), [tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), subExprInfo.typeParamExpr)], [subExprInfo.storeExpr2])])) //subExprInfo.storeExpr;)
                    storeExpr2 = tExpressionStatement(tFunctionCall(tMemberExpression(currentParam2, tIdentifier('forEach')), [tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), subExprInfo.typeParamExpr)], [subExprInfo.storeExpr2])])) //subExprInfo.storeExpr;
                }
            }
            if (subExprInfo.typeParamExpr) {
                result.typeParamExpr = tTypeWithParameters(tIdentifier('Array'), tTypeParametersExpression([subExprInfo.typeParamExpr]));
            }
        } else if (fieldType.kind == 'TLBCellInsideType') {
            let currentCell = getCurrentSlice([1, 0], 'cell');

            let subExprInfo: FieldInfoType;
            subExprInfo = this.handleType(field, fieldType.value, true, ctx, [1, 0], argIndex)
            if (subExprInfo.loadExpr) {
                result.typeParamExpr = subExprInfo.typeParamExpr;
                result.storeExpr = subExprInfo.storeExpr;
                result.negatedVariablesLoads = subExprInfo.negatedVariablesLoads;
                result.loadFunctionExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [sliceLoad([1, 0], 'slice'), tReturnStatement(subExprInfo.loadExpr)])
                result.loadExpr = tFunctionCall(result.loadFunctionExpr, [tIdentifier(theSlice)])
            }
            if (subExprInfo.storeExpr) {
                result.storeExpr = tMultiStatement([
                    tExpressionStatement(tDeclareVariable(tIdentifier(currentCell), tFunctionCall(tIdentifier('beginCell'), []))),
                    subExprInfo.storeExpr,
                    tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeRef')), [tIdentifier(currentCell)]))
                ])
            }
            if (subExprInfo.storeExpr2) {
                storeExpr2 = tMultiStatement([
                    tExpressionStatement(tDeclareVariable(tIdentifier(currentCell), tFunctionCall(tIdentifier('beginCell'), []))),
                    subExprInfo.storeExpr2,
                    tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeRef')), [tIdentifier(currentCell)]))
                ])
            }
        } else if (fieldType.kind == 'TLBNamedType' && fieldType.arguments.length) {
            let typeName = fieldType.name;

            let typeExpression: TypeParametersExpression = tTypeParametersExpression([]);
            let loadFunctionsArray: Array<Expression> = []
            let storeFunctionsArray: Array<Expression> = []
            let argIndex = -1;
            if (fieldType.kind == 'TLBNamedType') {
                fieldType.arguments.forEach(arg => {
                    argIndex++;
                    let subExprInfo = this.handleType(field, arg, false, ctx, slicePrefix, argIndex);
                    if (subExprInfo.typeParamExpr) {
                        typeExpression.typeParameters.push(subExprInfo.typeParamExpr);
                    }
                    if (subExprInfo.loadFunctionExpr) {
                        loadFunctionsArray.push(subExprInfo.loadFunctionExpr);
                    }
                    if (subExprInfo.storeFunctionExpr) {
                        storeFunctionsArray.push(subExprInfo.storeFunctionExpr);
                    }
                    result.negatedVariablesLoads = result.negatedVariablesLoads.concat(subExprInfo.negatedVariablesLoads);
                })
            }
            result.typeParamExpr = tTypeWithParameters(tIdentifier(typeName), typeExpression);

            let currentTypeParameters = typeExpression;

            let insideLoadParameters: Array<Expression> = [tIdentifier(theSlice)];

            result.loadExpr = tFunctionCall(tIdentifier('load' + typeName), insideLoadParameters.concat(loadFunctionsArray), currentTypeParameters);
            result.storeExpr = tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + typeName), insideStoreParameters.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(theCell)]))
            storeExpr2 = tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + typeName), insideStoreParameters2.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(theCell)]))
            if (exprForParam) {
                result.typeParamExpr = tIdentifier(exprForParam.paramType);
            }
        }

        if (exprForParam) {
            if (exprForParam.paramType != 'BitString' && exprForParam.paramType != 'Slice') {
                if (exprForParam.argStoreExpr) {
                    insideStoreParameters.push(exprForParam.argStoreExpr);
                    insideStoreParameters2.push(exprForParam.argStoreExpr);
                }
            }
            result.loadExpr = tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + exprForParam.fieldLoadSuffix)), (exprForParam.argLoadExpr ? [exprForParam.argLoadExpr] : []));
            if (exprForParam.paramType == 'Slice') {
                result.loadExpr = tIdentifier(currentSlice)
                result.loadFunctionExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [tReturnStatement(tIdentifier('slice'))])
            }
            result.typeParamExpr = tIdentifier(exprForParam.paramType);
            result.storeExpr = tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(theCell), tIdentifier('store' + exprForParam.fieldStoreSuffix)), insideStoreParameters));
            storeExpr2 = tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(theCell), tIdentifier('store' + exprForParam.fieldStoreSuffix)), insideStoreParameters2));
        }

        if (result.loadExpr && !result.loadFunctionExpr) {
            if (result.loadExpr.type == 'FunctionCall') {
                result.loadFunctionExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], [tReturnStatement(result.loadExpr)])
            } else {
                result.loadFunctionExpr = result.loadExpr
            }
        }
        if (result.storeExpr && !result.storeFunctionExpr) {
            if (!storeExpr2) {
                storeExpr2 = result.storeExpr
            }
            if (result.typeParamExpr) {
                if (result.storeExpr.type == 'ExpressionStatement' && result.storeExpr.expression.type == 'FunctionCall' || result.storeExpr.type == 'MultiStatement') {
                    result.storeFunctionExpr = tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), result.typeParamExpr)], [tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], [storeExpr2]))])
                } else {
                    if (result.storeExpr.type == 'ExpressionStatement') {
                        result.storeFunctionExpr = result.storeExpr.expression;
                    }
                }
            }
        }

        result.storeExpr2 = storeExpr2
        return result;
    }

}

