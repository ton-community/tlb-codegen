import {
  BuiltinOneArgExpr,
  BuiltinZeroArgs,
  CellRefExpr,
  CombinatorExpr,
  CondExpr,
  MathExpr,
  NameExpr,
  NegateExpr,
  NumberExpr,
  Expression as ParserExpression,
} from "@igorivaniuk/tlb-parser/dist/ast/nodes";
import {
  TLBBinaryOp,
  TLBFieldType,
  TLBMathExpr,
  TLBNumberExpr,
  TLBUnaryOp,
  TLBVarExpr,
} from "../ast";
import {
  TLBConstructorBuild,
  convertToMathExpr,
  getCalculatedExpression,
  splitForTypeValue,
} from "./utils";

export function getType(
  expr: ParserExpression,
  constructor: TLBConstructorBuild,
  fieldTypeName: string
): TLBFieldType {
  if (expr instanceof BuiltinZeroArgs) {
    if (expr.name == "#") {
      return {
        kind: "TLBNumberType",
        bits: new TLBNumberExpr(32),
        storeBits: new TLBNumberExpr(32),
        signed: false,
        maxBits: 32,
      };
    } else {
      throw new Error("Expression not supported" + expr);
    }
  } else if (expr instanceof BuiltinOneArgExpr) {
    if (expr.name.toString() == "##" || expr.name.toString() == "(##)") {
      if (expr.arg instanceof NumberExpr) {
        return {
          kind: "TLBNumberType",
          bits: new TLBNumberExpr(expr.arg.num),
          storeBits: new TLBNumberExpr(expr.arg.num),
          signed: false,
          maxBits: expr.arg.num,
        };
      }
      if (expr.arg instanceof NameExpr) {
        let parameter = constructor.parametersMap.get(expr.arg.name);
        if (
          !parameter ||
          !parameter.variable.deriveExpr ||
          !parameter.variable.initialExpr
        ) {
          throw new Error(`Couldn't handle expression ${expr}`);
        }
        return {
          kind: "TLBNumberType",
          bits: getCalculatedExpression(
            parameter.variable.deriveExpr,
            constructor
          ),
          storeBits: parameter.variable.initialExpr,
          signed: false,
          maxBits: undefined,
        };
      } else {
        throw new Error(`Couldn't handle expression ${expr}`);
      }
    } else if (expr.name == "#<") {
      if (expr.arg instanceof NumberExpr || expr.arg instanceof NameExpr) {
        let bits = new TLBUnaryOp(
          new TLBBinaryOp(
            getCalculatedExpression(convertToMathExpr(expr.arg), constructor),
            new TLBNumberExpr(1),
            "-"
          ),
          "."
        );
        return {
          kind: "TLBNumberType",
          bits: bits,
          storeBits: bits,
          signed: false,
          maxBits: 32,
        };
      } else {
        throw new Error(`Couldn't handle expression ${expr}`);
      }
    } else if (expr.name == "#<=") {
      if (expr.arg instanceof NumberExpr || expr.arg instanceof NameExpr) {
        let bits = new TLBUnaryOp(
          getCalculatedExpression(convertToMathExpr(expr.arg), constructor),
          "."
        );
        return {
          kind: "TLBNumberType",
          bits: bits,
          storeBits: bits,
          signed: false,
          maxBits: 32,
        };
      } else {
        throw new Error(`Couldn't handle expression ${expr}`);
      }
    }
  } else if (expr instanceof CombinatorExpr) {
    if (
      expr.name == "int" &&
      expr.args.length == 1 &&
      (expr.args[0] instanceof MathExpr ||
        expr.args[0] instanceof NumberExpr ||
        expr.args[0] instanceof NameExpr)
    ) {
      return {
        kind: "TLBNumberType",
        bits: getCalculatedExpression(
          convertToMathExpr(expr.args[0]),
          constructor
        ),
        storeBits: convertToMathExpr(expr.args[0]),
        signed: true,
        maxBits: undefined,
      };
    } else if (
      expr.name == "uint" &&
      expr.args.length == 1 &&
      (expr.args[0] instanceof MathExpr ||
        expr.args[0] instanceof NumberExpr ||
        expr.args[0] instanceof NameExpr)
    ) {
      return {
        kind: "TLBNumberType",
        bits: getCalculatedExpression(
          convertToMathExpr(expr.args[0]),
          constructor
        ),
        storeBits: convertToMathExpr(expr.args[0]),
        signed: false,
        maxBits: undefined,
      };
    } else if (
      expr.name == "bits" &&
      expr.args.length == 1 &&
      (expr.args[0] instanceof MathExpr ||
        expr.args[0] instanceof NumberExpr ||
        expr.args[0] instanceof NameExpr)
    ) {
      return {
        kind: "TLBBitsType",
        bits: getCalculatedExpression(
          convertToMathExpr(expr.args[0]),
          constructor
        ),
      };
    } else if (expr.name == "HashmapE") {
      if (expr.args.length != 2) {
        throw new Error('')
      }
      let key = getType(expr.args[0], constructor, fieldTypeName)
      let value = getType(expr.args[1], constructor, fieldTypeName)
      if (key.kind != 'TLBExprMathType') {
        throw new Error('Hashmap key should be number')
      }
      return { kind: "TLBHashmapType", key: key, value: value };
    } else if (
      expr.name == "VarUInteger" &&
      (expr.args[0] instanceof MathExpr ||
        expr.args[0] instanceof NumberExpr ||
        expr.args[0] instanceof NameExpr)
    ) {
      return {
        kind: "TLBVarIntegerType",
        n: new TLBUnaryOp(
          new TLBBinaryOp(convertToMathExpr(expr.args[0]), new TLBNumberExpr(1), '-'),
          "."
        ),
        signed: false,
      };
    } else if (
      expr.name == "VarInteger" &&
      (expr.args[0] instanceof MathExpr ||
        expr.args[0] instanceof NumberExpr ||
        expr.args[0] instanceof NameExpr)
    ) {
      return {
        kind: "TLBVarIntegerType",
        n: convertToMathExpr(expr.args[0]),
        signed: true,
      };
    } else {
      let argumentTypes: TLBFieldType[] = [];
      expr.args.forEach((arg) => {
        let thefield = getType(arg, constructor, fieldTypeName);
        argumentTypes.push(thefield);
      });
      return {
        kind: "TLBNamedType",
        name: expr.name,
        arguments: argumentTypes,
      };
    }
  } else if (expr instanceof NameExpr) {
    let theNum;
    if (expr.name == "Int") {
      return {
        kind: "TLBNumberType",
        bits: new TLBNumberExpr(257),
        storeBits: new TLBNumberExpr(257),
        signed: true,
        maxBits: 257,
      };
    } else if (expr.name == "Bits") {
      return { kind: "TLBBitsType", bits: new TLBNumberExpr(1023) };
    } else if (expr.name == "Bit") {
      return { kind: "TLBBitsType", bits: new TLBNumberExpr(1) };
    } else if (expr.name == "Uint") {
      return {
        kind: "TLBNumberType",
        bits: new TLBNumberExpr(257),
        storeBits: new TLBNumberExpr(257),
        signed: false,
        maxBits: 257,
      };
    } else if (expr.name == "Any" || expr.name == "Cell") {
      return { kind: "TLBCellType" };
    } else if ((theNum = splitForTypeValue(expr.name, "int")) != undefined) {
      return {
        kind: "TLBNumberType",
        bits: new TLBNumberExpr(theNum),
        storeBits: new TLBNumberExpr(theNum),
        signed: true,
        maxBits: theNum,
      };
    } else if ((theNum = splitForTypeValue(expr.name, "uint")) != undefined) {
      return {
        kind: "TLBNumberType",
        bits: new TLBNumberExpr(theNum),
        storeBits: new TLBNumberExpr(theNum),
        signed: false,
        maxBits: theNum,
      };
    } else if ((theNum = splitForTypeValue(expr.name, "bits")) != undefined) {
      return { kind: "TLBBitsType", bits: new TLBNumberExpr(theNum) };
    } else if (expr.name == "Bool") {
      return { kind: "TLBBoolType" };
    } else if (expr.name == "MsgAddressInt") {
      return { kind: "TLBAddressType", addrType: "Internal" };
    } else if (expr.name == "MsgAddressExt") {
      return { kind: "TLBAddressType", addrType: "External" };
    } else if (expr.name == "MsgAddress") {
      return { kind: "TLBAddressType", addrType: "Any" };
    } else if (expr.name == "Bit") {
      return { kind: "TLBBitsType", bits: new TLBNumberExpr(1) };
    } else if (expr.name == "Grams") {
      return { kind: "TLBCoinsType" };
    } else {
      if (constructor.variablesMap.get(expr.name)?.type == "#") {
        return {
          kind: "TLBExprMathType",
          expr: getCalculatedExpression(new TLBVarExpr(expr.name), constructor),
        };
      } else {
        return { kind: "TLBNamedType", name: expr.name, arguments: [] };
      }
    }
  } else if (expr instanceof NumberExpr) {
    return { kind: "TLBExprMathType", expr: new TLBNumberExpr(expr.num) };
  } else if (expr instanceof NegateExpr && expr.expr instanceof NameExpr) {
    return { kind: "TLBNegatedType", variableName: expr.expr.name };
  } else if (expr instanceof CellRefExpr) {
    let subExprInfo = getType(expr.expr, constructor, fieldTypeName);
    return { kind: "TLBCellInsideType", value: subExprInfo };
  } else if (expr instanceof MathExpr) {
    if (fieldTypeName == "") {
      if (expr.op == "*") {
        let subExprInfo = getType(expr.right, constructor, fieldTypeName);
        return {
          kind: "TLBMultipleType",
          times: getCalculatedExpression(
            convertToMathExpr(expr.left),
            constructor
          ),
          value: subExprInfo,
        };
      } else {
        throw new Error(`Couldn't handle expression ${expr}`);
      }
    } else {
      return {
        kind: "TLBExprMathType",
        expr: getCalculatedExpression(convertToMathExpr(expr), constructor),
      };
    }
  } else if (expr instanceof CondExpr) {
    let subExprInfo = getType(expr.condExpr, constructor, fieldTypeName);
    if (expr.left instanceof NameExpr) {
      let condition: TLBMathExpr = getCalculatedExpression(
        convertToMathExpr(expr.left),
        constructor
      );
      if (expr.dotExpr != null) {
        condition = new TLBBinaryOp(
          condition,
          new TLBBinaryOp(
            new TLBNumberExpr(1),
            new TLBNumberExpr(expr.dotExpr),
            "<<"
          ),
          "&"
        );
      }
      return { kind: "TLBCondType", value: subExprInfo, condition: condition };
    }
  } else {
    throw new Error(`Couldn't handle expression ${expr}`);
  }
  throw new Error(`Couldn't handle expression ${expr}`);
}
