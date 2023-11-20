import { SimpleExpr, NameExpr, NumberExpr, MathExpr, FieldBuiltinDef, NegateExpr, Declaration, CompareExpr } from "../ast/nodes";
import { MyMathExpr, MyVarExpr, MyNumberExpr, MyBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from "../codegen/ast"
import { Identifier, Expression, BinaryExpression } from "./tsgen";
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, toCodeArray } from './tsgen'

export function convertToMathExpr(mathExpr: SimpleExpr | NameExpr | NumberExpr | CompareExpr): MyMathExpr {
    if (mathExpr instanceof NameExpr) {
        return new MyVarExpr(mathExpr.name, true);
    }
    if (mathExpr instanceof NumberExpr) {
        return new MyNumberExpr(mathExpr.num, false);
    }
    if (mathExpr instanceof MathExpr) {
        let left = convertToMathExpr(mathExpr.left)
        let right = convertToMathExpr(mathExpr.right)
        return new MyBinaryOp(left, right, mathExpr.op, left.hasX || right.hasX)
    }
    if (mathExpr instanceof CompareExpr) {
        let left = convertToMathExpr(mathExpr.left);
        let right = convertToMathExpr(mathExpr.right);
        return new MyBinaryOp(left, right, mathExpr.op, left.hasX || right.hasX)
    }
    return { n: 0, hasX: false };
}

export function convertToAST(mathExpr: MyMathExpr, objectId?: Identifier): Expression {
    if (mathExpr instanceof MyVarExpr) {
        if (objectId != undefined) {
            return tMemberExpression(objectId, tIdentifier(mathExpr.x));
        }
        return tIdentifier(mathExpr.x);
    }
    if (mathExpr instanceof MyNumberExpr) {
        return tNumericLiteral(mathExpr.n)
    }
    if (mathExpr instanceof MyBinaryOp) {
        return tBinaryExpression(convertToAST(mathExpr.left, objectId), mathExpr.operation, convertToAST(mathExpr.right, objectId));
    }
    return tIdentifier('');
}

export function reorganizeExpression(mathExpr: MyMathExpr): MyMathExpr {
    if (mathExpr instanceof MyVarExpr || mathExpr instanceof MyNumberExpr) {
        return mathExpr
    }
    if (mathExpr instanceof MyBinaryOp) {
        let op = '';
        if (mathExpr.operation == '*') {
            op = '/';
        } else if (mathExpr.operation == '+') {
            op = '-'
        }
        let left = undefined;
        let right = undefined;
        if (mathExpr.left.hasX) {
            left = mathExpr.left;
            right = mathExpr.right
        } else {
            right = mathExpr.left
            left = mathExpr.right
        }
        return new MyBinaryOp(
            reorganizeExpression(left),
            reorganizeExpression(right),
            op,
            mathExpr.hasX
        )
    }
    return { n: 0, hasX: false }
}

export function getXname(myMathExpr: MyMathExpr): string {
    if (myMathExpr instanceof MyVarExpr) {
        return myMathExpr.x;
    }
    if (myMathExpr instanceof MyBinaryOp) {
        if (myMathExpr.left.hasX) {
            return getXname(myMathExpr.left);
        } else {
            return getXname(myMathExpr.right);
        }
    }
    return '';
}

export function deriveMathExpression(mathExpr: MathExpr | NameExpr | NumberExpr) {
    let myMathExpr = convertToMathExpr(mathExpr);
    // myMathExpr = reorganizeExpression(myMathExpr);
    let derived = convertToAST(myMathExpr)
    return {
        name: getXname(myMathExpr),
        derived: derived,
    }
}


export function firstLower(structName: String) {
    return structName.charAt(0).toLowerCase() + structName.slice(1)
}

export function splitForTypeValue(name: string, typeName: string) {
    if (!name.startsWith(typeName)) {
        return undefined;
    }
    let num = parseInt(name.slice(typeName.length))
    if (num == undefined) {
        return undefined
    }
    if (name != typeName + num.toString()) {
        return undefined
    }
    return num
}

export function getCurrentSlice(slicePrefix: number[], name: string): string {
    let result = name;
    slicePrefix = slicePrefix.slice(0, slicePrefix.length - 1);
    slicePrefix.forEach(element => {
        result += element.toString();
    });
    if (result == 'cell') {
        return 'builder';
    }
    return result;
}

export function bitLen(n: number) {
    return n.toString(2).length;
}

// export type TLBVariable = {
//   name: string,

// }

// export type TLBField = {
//   name: string
//   expression: 
// }

export function getTypeParametersExpression(parameters: Array<TLBParameter>) {
    let structTypeParameters: Array<Identifier> = []
    parameters.forEach(element => {
        if (element.variable.type == 'Type') {
            structTypeParameters.push(tIdentifier(element.variable.name))
        }
    });
    let structTypeParametersExpr = tTypeParametersExpression(structTypeParameters);
    return structTypeParametersExpr;
}

export function getCondition(conditions: Array<BinaryExpression>): Expression {
    let cnd = conditions[0];
    if (cnd) {
        if (conditions.length > 1) {
            return tBinaryExpression(cnd, '&&', getCondition(conditions.slice(1)));
        } else {
            return cnd
        }
    } else {
        return tIdentifier('true');
    }
}

export function checkConstructors(tlbType: TLBType) {
    // TODO
}

export function fillParameterNames(tlbType: TLBType) {
    let parameterNames: string[] = []
    tlbType.constructors[0]?.parameters.forEach(element => {
        parameterNames.push(element.variable.name);
    });
    tlbType.constructors.forEach(constructor => {
        for (let i = 0; i < constructor.parameters.length; i++) {
            if (parameterNames[i] == '') {
                let parameterName = constructor.parameters[i]?.variable.name;
                if (parameterName != undefined) {
                    parameterNames[i] = parameterName;
                }
            }
        }
    });
    for (let i = 0; i < parameterNames.length; i++) {
        if (parameterNames[i] == '') {
            parameterNames[i] = 'arg' + i;
        }
    }
    tlbType.constructors.forEach(constructor => {
        for (let i = 0; i < constructor.parameters.length; i++) {
            let parameterName = parameterNames[i]
            if (parameterName != undefined && constructor.parameters[i]?.variable.name == '') {
                constructor.parameters[i]!.variable.name = parameterName;
            }
        }
    })
}

export function fillConstructors(declarations: Declaration[], tlbCode: TLBCode) {
    declarations.forEach(declaration => {
        let tlbType: TLBType | undefined = tlbCode.types.get(declaration.combinator.name);
        if (tlbType == undefined) {
            tlbType = { name: declaration.combinator.name, constructors: [] }
        }
        tlbType.constructors.push({ declaration: declaration, parameters: [], parametersMap: new Map<string, TLBParameter>(), implicitFields: new Map<string, string>(), name: declaration.constructorDef.name });
        tlbCode.types.set(tlbType.name, tlbType);
    })

    tlbCode.types.forEach((tlbType: TLBType, combinatorName: string) => {
        tlbType.constructors.forEach(constructor => {

            constructor.declaration?.fields.forEach(field => {
                if (field instanceof FieldBuiltinDef) {
                    constructor.implicitFields.set(field.name, field.type);
                }
            })

            constructor.declaration.combinator.args.forEach(element => {
                let parameter: TLBParameter | undefined = undefined;
                if (element instanceof NameExpr) {
                    if (constructor.implicitFields.has(element.name)) {
                        let variable: TLBVariable;
                        if (constructor.implicitFields.get(element.name) == 'Type') {
                            variable = { negated: false, const: false, type: 'Type', name: element.name }
                        }
                        else {
                            variable = { negated: false, const: false, type: '#', name: element.name }
                        }
                        parameter = { variable: variable, expression: tIdentifier(element.name) };
                    }
                    else {
                        throw new Error('Field not known before using (should be tagged as implicit): ' + element)
                    }
                } else if (element instanceof MathExpr) {
                    let derivedExpr = deriveMathExpression(element);
                    parameter = { variable: { negated: false, const: false, type: '#', name: derivedExpr.name }, expression: derivedExpr.derived };
                } else if (element instanceof NegateExpr && (element.expr instanceof MathExpr || element.expr instanceof NumberExpr || element.expr instanceof NameExpr)) {
                    let derivedExpr = deriveMathExpression(element.expr);
                    let toBeConst = false;
                    if (element.expr instanceof NumberExpr) {
                        toBeConst = true;
                    }
                    parameter = { variable: { negated: true, const: toBeConst, type: '#', name: derivedExpr.name }, expression: derivedExpr.derived };
                } else if (element instanceof NumberExpr) {
                    parameter = { variable: { negated: false, const: true, type: '#', name: '' }, expression: tNumericLiteral(element.num) }
                } else {
                    // throw new Error('Cannot identify combinator arg: ' + element)
                }
                if (parameter) {
                    constructor.parameters.push(parameter);
                    constructor.parametersMap.set(parameter.variable.name, parameter);
                }
            });
        });
        checkConstructors(tlbType);
        fillParameterNames(tlbType);
    });
}