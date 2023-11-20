import { Declaration  } from "../../src/ast/nodes";
import { Expression } from "../../src/codegen/tsgen";

export class MyBinaryOp {
    constructor(
        readonly left: MyMathExpr,
        readonly right: MyMathExpr,
        readonly operation: string,
        readonly variables: Set<string>,
        readonly hasNeg: boolean
        ) {
    }
}

export class MyNumberExpr {
    constructor(
        readonly n: number,
        readonly variables: Set<string>,
        readonly hasNeg: boolean
    ) {

    }
}

export class MyVarExpr {
    constructor(
        readonly x: string,
        readonly variables: Set<string>,
        readonly hasNeg: boolean
    ) {

    }
}

export type MyMathExpr = MyBinaryOp | MyNumberExpr | MyVarExpr;

export type TLBVariableType = 'Type' | '#';

export type TLBVariable = {
    const: boolean
    negated: boolean
    type: TLBVariableType
    name: string
}

export type TLBParameter = {
    variable: TLBVariable,
    expression: Expression
}

export type TLBConstructor = {
    parameters: Array<TLBParameter>
    parametersMap: Map<string, TLBParameter>
    name: string
    implicitFields: Map<string, string>
    declaration: Declaration
    negatedVariables: Map<string, Expression>
}

export type TLBType = {
    name: string
    constructors: Array<TLBConstructor>
}

export type TLBCode = {
    types: Map<string, TLBType>
}
