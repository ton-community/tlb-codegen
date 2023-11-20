import { Declaration  } from "../../src/ast/nodes";
import { Expression } from "../../src/codegen/tsgen";

export class MyBinaryOp {
    constructor(
        readonly left: MyMathExpr,
        readonly right: MyMathExpr,
        readonly operation: string,
        readonly hasX: boolean) {
    }
}

export class MyNumberExpr {
    constructor(
        readonly n: number,
        readonly hasX: false
    ) {

    }
}

export class MyVarExpr {
    constructor(
        readonly x: string,
        readonly hasX: true
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
}

export type TLBType = {
    name: string
    constructors: Array<TLBConstructor>
}

export type TLBCode = {
    types: Map<string, TLBType>
}
