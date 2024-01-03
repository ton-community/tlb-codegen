import { Expression, tBinaryExpression } from "./tsgen";

export function tEqualExpression(left: Expression, right: Expression) {
    return tBinaryExpression(left, '==', right)
}