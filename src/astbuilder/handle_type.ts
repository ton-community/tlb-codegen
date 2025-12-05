import {
    BuiltinOneArgExpr,
    BuiltinZeroArgs,
    CellRefExpr,
    CombinatorExpr,
    CondExpr,
    FieldAnonExpr,
    FieldExprDef,
    MathExpr,
    NameExpr,
    NegateExpr,
    NumberExpr,
    Expression as ParserExpression,
} from '@ton-community/tlb-parser';

import { TLBBinaryOp, TLBFieldType, TLBMathExpr, TLBNumberExpr, TLBUnaryOp, TLBVarExpr } from '../ast';
import { TLBConstructorBuild, convertToMathExpr, getCalculatedExpression, splitForTypeValue } from './utils';

export function getType(expr: ParserExpression, constructor: TLBConstructorBuild, fieldTypeName: string): TLBFieldType {
    if (expr instanceof BuiltinZeroArgs) {
        if (expr.name == '#') {
            return {
                kind: 'TLBNumberType',
                bits: new TLBNumberExpr(32),
                storeBits: new TLBNumberExpr(32),
                signed: false,
                maxBits: 32,
            };
        } else {
            throw new Error('Expression not supported' + expr);
        }
    } else if (expr instanceof BuiltinOneArgExpr) {
        if (expr.name.toString() == '##' || expr.name.toString() == '(##)') {
            if (expr.arg instanceof NumberExpr) {
                return {
                    kind: 'TLBNumberType',
                    bits: new TLBNumberExpr(expr.arg.num),
                    storeBits: new TLBNumberExpr(expr.arg.num),
                    signed: false,
                    maxBits: expr.arg.num,
                };
            }
            if (expr.arg instanceof NameExpr) {
                let parameter = constructor.parametersMap.get(expr.arg.name);
                if (!parameter || !parameter.variable.deriveExpr || !parameter.variable.initialExpr) {
                    const argType = expr.arg.constructor.name;
                    const argName = expr.arg.name;
                    throw new Error(
                        `Couldn't handle ## expression with NameExpr arg '${argName}' (type: ${argType}): parameter not found or missing deriveExpr/initialExpr`,
                    );
                }
                return {
                    kind: 'TLBNumberType',
                    bits: getCalculatedExpression(parameter.variable.deriveExpr, constructor),
                    storeBits: parameter.variable.initialExpr,
                    signed: false,
                    maxBits: undefined,
                };
            } else if (expr.arg instanceof MathExpr) {
                return {
                    kind: 'TLBNumberType',
                    bits: getCalculatedExpression(convertToMathExpr(expr.arg), constructor),
                    storeBits: convertToMathExpr(expr.arg),
                    signed: false,
                    maxBits: undefined,
                };
            } else {
                const argType = expr.arg.constructor.name;
                throw new Error(
                    `Couldn't handle ## expression with arg of type ${argType} (expected NumberExpr, NameExpr, or MathExpr)`,
                );
            }
        } else if (expr.name == '#<') {
            if (expr.arg instanceof NumberExpr || expr.arg instanceof NameExpr) {
                let bits = new TLBUnaryOp(
                    new TLBBinaryOp(
                        getCalculatedExpression(convertToMathExpr(expr.arg), constructor),
                        new TLBNumberExpr(1),
                        '-',
                    ),
                    '.',
                );
                return {
                    kind: 'TLBNumberType',
                    bits: bits,
                    storeBits: bits,
                    signed: false,
                    maxBits: 32,
                };
            } else {
                const argType = expr.arg.constructor.name;
                throw new Error(
                    `Couldn't handle #< expression with arg of type ${argType} (expected NumberExpr or NameExpr)`,
                );
            }
        } else if (expr.name == '#<=') {
            if (expr.arg instanceof NumberExpr || expr.arg instanceof NameExpr) {
                let bits = new TLBUnaryOp(getCalculatedExpression(convertToMathExpr(expr.arg), constructor), '.');
                return {
                    kind: 'TLBNumberType',
                    bits: bits,
                    storeBits: bits,
                    signed: false,
                    maxBits: 32,
                };
            } else {
                const argType = expr.arg.constructor.name;
                throw new Error(
                    `Couldn't handle #<= expression with arg of type ${argType} (expected NumberExpr or NameExpr)`,
                );
            }
        } else {
            throw new Error(`Couldn't handle BuiltinOneArgExpr with name ${expr.name}`);
        }
    } else if (expr instanceof CombinatorExpr) {
        if (
            expr.name == 'int' &&
            expr.args.length == 1 &&
            (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)
        ) {
            return {
                kind: 'TLBNumberType',
                bits: getCalculatedExpression(convertToMathExpr(expr.args[0]), constructor),
                storeBits: convertToMathExpr(expr.args[0]),
                signed: true,
                maxBits: undefined,
            };
        } else if (
            expr.name == 'uint' &&
            expr.args.length == 1 &&
            (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)
        ) {
            return {
                kind: 'TLBNumberType',
                bits: getCalculatedExpression(convertToMathExpr(expr.args[0]), constructor),
                storeBits: convertToMathExpr(expr.args[0]),
                signed: false,
                maxBits: undefined,
            };
        } else if (
            expr.name == 'bits' &&
            expr.args.length == 1 &&
            (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)
        ) {
            return {
                kind: 'TLBBitsType',
                bits: getCalculatedExpression(convertToMathExpr(expr.args[0]), constructor),
            };
        } else if (expr.name == 'HashmapE') {
            if (expr.args.length != 2) {
                throw new Error('');
            }
            let key = getType(expr.args[0], constructor, fieldTypeName);
            let value = getType(expr.args[1], constructor, fieldTypeName);
            if (key.kind != 'TLBExprMathType') {
                throw new Error('Hashmap key should be number');
            }
            return { kind: 'TLBHashmapType', key: key, value: value, directStore: false };
        } else if (expr.name == 'HashmapAugE') {
            if (expr.args.length != 3) {
                throw new Error('Not enough arguments for HashmapAugE');
            }
            let key = getType(expr.args[0], constructor, fieldTypeName);
            let value = getType(expr.args[1], constructor, fieldTypeName);
            let extra = getType(expr.args[2], constructor, fieldTypeName);
            if (key.kind != 'TLBExprMathType') {
                throw new Error('Hashmap key should be number');
            }
            return { kind: 'TLBHashmapType', key: key, value: value, extra: extra, directStore: false };
        } else if (expr.name == 'Hashmap' && constructor.tlbType != 'HashmapNode') {
            let key = getType(expr.args[0], constructor, fieldTypeName);
            let value = getType(expr.args[1], constructor, fieldTypeName);
            if (key.kind != 'TLBExprMathType') {
                throw new Error('Hashmap key should be number');
            }
            return { kind: 'TLBHashmapType', key: key, value: value, directStore: true };
        } else if (
            expr.name == 'VarUInteger' &&
            (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)
        ) {
            return {
                kind: 'TLBVarIntegerType',
                n: new TLBUnaryOp(new TLBBinaryOp(convertToMathExpr(expr.args[0]), new TLBNumberExpr(1), '-'), '.'),
                signed: false,
            };
        } else if (
            expr.name == 'VarInteger' &&
            (expr.args[0] instanceof MathExpr || expr.args[0] instanceof NumberExpr || expr.args[0] instanceof NameExpr)
        ) {
            return {
                kind: 'TLBVarIntegerType',
                n: convertToMathExpr(expr.args[0]),
                signed: true,
            };
        } else {
            let argumentTypes: TLBFieldType[] = [];
            expr.args.forEach((arg, index) => {
                try {
                    const argType = arg.constructor.name;
                    if (argType === 'FieldAnonExpr' || argType.includes('Field')) {
                        throw new Error(
                            `CombinatorExpr '${expr.name}' argument ${index} is of type ${argType}, which is a field expression, not a type expression`,
                        );
                    }
                    let thefield = getType(arg, constructor, fieldTypeName);
                    argumentTypes.push(thefield);
                } catch (error) {
                    const argType = arg.constructor.name;
                    throw new Error(
                        `Couldn't handle CombinatorExpr '${expr.name}' argument ${index} of type ${argType}: ${error instanceof Error ? error.message : String(error)}`,
                    );
                }
            });
            return {
                kind: 'TLBNamedType',
                name: expr.name,
                arguments: argumentTypes,
            };
        }
    } else if (expr instanceof NameExpr) {
        let theNum;
        if (expr.name == 'Int') {
            return {
                kind: 'TLBNumberType',
                bits: new TLBNumberExpr(257),
                storeBits: new TLBNumberExpr(257),
                signed: true,
                maxBits: 257,
            };
        } else if (expr.name == 'VmStack') {
            return {
                kind: 'TLBTupleType',
            };
        } else if (expr.name == 'Bits') {
            return { kind: 'TLBBitsType', bits: new TLBNumberExpr(1023) };
        } else if (expr.name == 'Bit') {
            return { kind: 'TLBBitsType', bits: new TLBNumberExpr(1) };
        } else if (expr.name == 'Uint') {
            return {
                kind: 'TLBNumberType',
                bits: new TLBNumberExpr(257),
                storeBits: new TLBNumberExpr(257),
                signed: false,
                maxBits: 257,
            };
        } else if (expr.name == 'Any' || expr.name == 'Cell') {
            return { kind: 'TLBCellType' };
        } else if ((theNum = splitForTypeValue(expr.name, 'int')) != undefined) {
            return {
                kind: 'TLBNumberType',
                bits: new TLBNumberExpr(theNum),
                storeBits: new TLBNumberExpr(theNum),
                signed: true,
                maxBits: theNum,
            };
        } else if ((theNum = splitForTypeValue(expr.name, 'uint')) != undefined) {
            return {
                kind: 'TLBNumberType',
                bits: new TLBNumberExpr(theNum),
                storeBits: new TLBNumberExpr(theNum),
                signed: false,
                maxBits: theNum,
            };
        } else if ((theNum = splitForTypeValue(expr.name, 'bits')) != undefined) {
            return { kind: 'TLBBitsType', bits: new TLBNumberExpr(theNum) };
        } else if (expr.name == 'MsgAddressInt') {
            return { kind: 'TLBAddressType', addrType: 'Internal' };
        } else if (expr.name == 'MsgAddressExt') {
            return { kind: 'TLBAddressType', addrType: 'External' };
        } else if (expr.name == 'MsgAddress') {
            return { kind: 'TLBAddressType', addrType: 'Any' };
        } else if (expr.name == 'Grams' || expr.name == 'Coins') {
            return { kind: 'TLBCoinsType' };
        } else if (expr.name == 'Bool') {
            return { kind: 'TLBBoolType', value: undefined };
        } else if (expr.name == 'BoolFalse') {
            return { kind: 'TLBBoolType', value: false };
        } else if (expr.name == 'BoolTrue') {
            return { kind: 'TLBBoolType', value: true };
        } else {
            if (constructor.variablesMap.get(expr.name)?.type == '#') {
                return {
                    kind: 'TLBExprMathType',
                    expr: getCalculatedExpression(new TLBVarExpr(expr.name), constructor),
                    initialExpr: new TLBVarExpr(expr.name),
                };
            } else {
                return { kind: 'TLBNamedType', name: expr.name, arguments: [] };
            }
        }
    } else if (expr instanceof NumberExpr) {
        return { kind: 'TLBExprMathType', expr: new TLBNumberExpr(expr.num), initialExpr: new TLBNumberExpr(expr.num) };
    } else if (expr instanceof NegateExpr && expr.expr instanceof NameExpr) {
        return { kind: 'TLBNegatedType', variableName: expr.expr.name };
    } else if (expr instanceof CellRefExpr) {
        let subExprInfo = getType(expr.expr, constructor, fieldTypeName);
        return { kind: 'TLBCellInsideType', value: subExprInfo };
    } else if (expr instanceof MathExpr) {
        if (fieldTypeName == '') {
            if (expr.op == '*') {
                // Handle (x * ^Cell) case - if right is CellRefExpr, treat it as array of Cell references
                if (expr.right instanceof CellRefExpr) {
                    // For (x * ^Cell), we want TLBMultipleType with TLBCellType
                    // Check if the inner expression is Cell or Any
                    let innerExpr = expr.right.expr;
                    if (innerExpr instanceof NameExpr && (innerExpr.name == 'Cell' || innerExpr.name == 'Any')) {
                        return {
                            kind: 'TLBMultipleType',
                            times: getCalculatedExpression(convertToMathExpr(expr.left), constructor),
                            value: { kind: 'TLBCellType' },
                        };
                    }
                }

                if (expr.right instanceof FieldAnonExpr && expr.right.fields.length === 1) {
                    const fieldDef = expr.right.fields[0];
                    if (fieldDef instanceof FieldExprDef && fieldDef.expr instanceof NameExpr) {
                        const typeName = fieldDef.expr.name;
                        const numBits = splitForTypeValue(typeName, 'uint') || splitForTypeValue(typeName, 'int');
                        if (numBits !== undefined) {
                            return {
                                kind: 'TLBMultipleType',
                                times: getCalculatedExpression(convertToMathExpr(expr.left), constructor),
                                value: {
                                    kind: 'TLBNumberType',
                                    bits: new TLBNumberExpr(numBits),
                                    storeBits: new TLBNumberExpr(numBits),
                                    signed: typeName.startsWith('int'),
                                    maxBits: numBits,
                                },
                            };
                        }
                    }
                }
                let subExprInfo = getType(expr.right, constructor, fieldTypeName);
                return {
                    kind: 'TLBMultipleType',
                    times: getCalculatedExpression(convertToMathExpr(expr.left), constructor),
                    value: subExprInfo,
                };
            } else {
                const op = expr.op;
                throw new Error(
                    `Couldn't handle MathExpr with operation '${op}' when fieldTypeName is empty (only '*' is supported)`,
                );
            }
        } else {
            return {
                kind: 'TLBExprMathType',
                expr: getCalculatedExpression(convertToMathExpr(expr), constructor),
                initialExpr: convertToMathExpr(expr),
            };
        }
    } else if (expr instanceof CondExpr) {
        let subExprInfo = getType(expr.condExpr, constructor, fieldTypeName);
        if (expr.left instanceof NameExpr) {
            let condition: TLBMathExpr = getCalculatedExpression(convertToMathExpr(expr.left), constructor);
            if (expr.dotExpr != null) {
                condition = new TLBBinaryOp(
                    condition,
                    new TLBBinaryOp(new TLBNumberExpr(1), new TLBNumberExpr(expr.dotExpr), '<<'),
                    '&',
                );
            }
            return { kind: 'TLBCondType', value: subExprInfo, condition: condition };
        } else {
            try {
                let condition: TLBMathExpr = getCalculatedExpression(convertToMathExpr(expr.left), constructor);
                if (expr.dotExpr != null) {
                    condition = new TLBBinaryOp(
                        condition,
                        new TLBBinaryOp(new TLBNumberExpr(1), new TLBNumberExpr(expr.dotExpr), '<<'),
                        '&',
                    );
                }
                return { kind: 'TLBCondType', value: subExprInfo, condition: condition };
            } catch (error) {
                const leftType = expr.left.constructor.name;
                throw new Error(
                    `Couldn't handle CondExpr with left side of type ${leftType}: ${error instanceof Error ? error.message : String(error)}`,
                );
            }
        }
    } else {
        const exprType = expr.constructor.name;
        if (exprType === 'FieldAnonExpr') {
            return { kind: 'TLBCellType' };
        }
        if (
            exprType.includes('Field') &&
            exprType !== 'FieldExprDef' &&
            exprType !== 'FieldNamedDef' &&
            exprType !== 'FieldAnonymousDef' &&
            exprType !== 'FieldBuiltinDef' &&
            exprType !== 'FieldCurlyExprDef'
        ) {
            throw new Error(`Field expression type ${exprType} should not be processed as a type expression`);
        }
        let exprDetails: string;
        try {
            exprDetails = JSON.stringify(expr, null, 2);
        } catch {
            exprDetails = String(expr);
        }
        throw new Error(`Couldn't handle expression of type ${exprType}: ${exprDetails}`);
    }
}
