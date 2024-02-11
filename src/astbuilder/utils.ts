import {
  CompareExpr,
  MathExpr,
  NameExpr,
  NegateExpr,
  NumberExpr,
  SimpleExpr,
} from "@ton-community/tlb-parser";
import {
  TLBBinaryOp,
  TLBConstructorTag,
  TLBField,
  TLBMathExpr,
  TLBNumberExpr,
  TLBVarExpr,
  TLBVariableType,
} from "../ast";


export type TLBVariableBuild = {
  isConst: boolean;
  negated: boolean;
  type: TLBVariableType;
  name: string | undefined;
  deriveExpr?: TLBMathExpr;
  initialExpr?: TLBMathExpr;
  isField: boolean;

  calculated: boolean;
};
export type TLBParameterBuild = {
  variable: TLBVariableBuild;
  paramExpr: TLBMathExpr;
  argName?: string;
};
export type TLBConstructorBuild = {
  parameters: Array<TLBParameterBuild>;
  variables: Array<TLBVariableBuild>;
  variablesMap: Map<string, TLBVariableBuild>;
  parametersMap: Map<string, TLBParameterBuild>;
  name: string;
  fields: Array<TLBField>;
  tag: TLBConstructorTag;
  constraints: Array<TLBMathExpr>;
  declaration: string;
  tlbType: string;
};
export type TLBCodeBuild = {
  types: Map<string, TLBTypeBuild>;
};
export type TLBTypeBuild = {
  name: string;
  constructors: Array<TLBConstructorBuild>;
};
export function opCodeSetsEqual(a: string[], b: string[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  a = a.sort();
  b = b.sort();

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
export function calculateVariable(
  variable: TLBVariableBuild,
  constructor: TLBConstructorBuild
) {
  if (variable.calculated) {
    return;
  }
  if (!variable.deriveExpr) {
    return;
  }
  variable.calculated = true;
  variable.deriveExpr = getCalculatedExpression(
    variable.deriveExpr,
    constructor
  );
}
export function getCalculatedExpression(
  expr: TLBMathExpr,
  constructor: TLBConstructorBuild
): TLBMathExpr {
  if (expr instanceof TLBVarExpr) {
    let variable = constructor.variablesMap.get(expr.x);
    if (variable) {
      calculateVariable(variable, constructor);
      if (variable.deriveExpr) {
        return variable.deriveExpr;
      }
    }
  }
  if (expr instanceof TLBBinaryOp) {
    let left = getCalculatedExpression(expr.left, constructor);
    let right = getCalculatedExpression(expr.right, constructor);
    return new TLBBinaryOp(
      left,
      right,
      expr.operation,
      expr.variables,
      expr.hasNeg
    );
  }
  return expr;
}
export function splitForTypeValue(name: string, typeName: string) {
  if (!name.startsWith(typeName)) {
    return undefined;
  }
  let num = parseInt(name.slice(typeName.length));
  if (num == undefined) {
    return undefined;
  }
  if (name != typeName + num.toString()) {
    return undefined;
  }
  return num;
}
export function deriveMathExpression(
  mathExpr: MathExpr | NameExpr | NumberExpr | CompareExpr
) {
  let myMathExpr = convertToMathExpr(mathExpr);
  return {
    name: getVariableName(myMathExpr),
    derived: myMathExpr,
  };
}
export function getVariableName(myMathExpr: TLBMathExpr): string | undefined {
  if (myMathExpr instanceof TLBVarExpr) {
    return myMathExpr.x;
  }
  if (myMathExpr instanceof TLBBinaryOp) {
    if (myMathExpr.left.variables.size) {
      return getVariableName(myMathExpr.left);
    } else {
      return getVariableName(myMathExpr.right);
    }
  }
  return undefined;
}
export function reorganizeExpression(
  mathExpr: TLBMathExpr,
  variable: string
): TLBMathExpr {
  if (mathExpr instanceof TLBBinaryOp && mathExpr.operation == "=") {
    if (mathExpr.left.variables.has(variable)) {
      mathExpr = new TLBBinaryOp(
        mathExpr.right,
        mathExpr.left,
        "=",
        mathExpr.variables,
        mathExpr.hasNeg
      );
    }
    if (mathExpr.right instanceof TLBVarExpr) {
      return new TLBBinaryOp(
        mathExpr.right,
        mathExpr.left,
        "=",
        mathExpr.variables,
        mathExpr.hasNeg
      );
    }
    let rightSide = mathExpr.right;
    if (rightSide instanceof TLBBinaryOp) {
      let op = "";
      if (rightSide.operation == "*") {
        op = "/";
      } else if (rightSide.operation == "+") {
        op = "-";
      } else {
        throw new Error("invalid operation");
      }
      let withVariable = undefined;
      let other = undefined;
      if (rightSide.left.variables.has(variable)) {
        withVariable = rightSide.left;
        other = rightSide.right;
      } else {
        other = rightSide.left;
        withVariable = rightSide.right;
      }
      let leftSide = new TLBBinaryOp(mathExpr.left, other, op);
      mathExpr = new TLBBinaryOp(
        leftSide,
        withVariable,
        "=",
        new Set([...leftSide.variables, ...withVariable.variables]),
        leftSide.hasNeg || rightSide.hasNeg
      );
      return reorganizeExpression(mathExpr, variable);
    }
  }
  throw new Error(`Couldn't reogranize expression: ${mathExpr}`);
}
export function getNegatedVariable(mathExpr: TLBMathExpr): string | undefined {
  if (mathExpr.hasNeg) {
    if (mathExpr instanceof TLBBinaryOp) {
      if (mathExpr.left.hasNeg) {
        return getNegatedVariable(mathExpr.left);
      }
      if (mathExpr.right.hasNeg) {
        return getNegatedVariable(mathExpr.right);
      }
    }
    if (mathExpr instanceof TLBVarExpr) {
      return mathExpr.x;
    }
  }
  return undefined;
}
export function convertToMathExpr(
  mathExpr: SimpleExpr | NameExpr | NumberExpr | CompareExpr,
  negated: boolean = false
): TLBMathExpr {
  if (mathExpr instanceof NameExpr) {
    let variables = new Set<string>();
    variables.add(mathExpr.name);
    return new TLBVarExpr(mathExpr.name, variables, negated);
  }
  if (mathExpr instanceof NumberExpr) {
    return new TLBNumberExpr(mathExpr.num, new Set<string>(), false);
  }
  if (mathExpr instanceof MathExpr) {
    let left = convertToMathExpr(mathExpr.left, negated);
    let right = convertToMathExpr(mathExpr.right, negated);
    return new TLBBinaryOp(left, right, mathExpr.op);
  }
  if (mathExpr instanceof CompareExpr) {
    let left = convertToMathExpr(mathExpr.left, negated);
    let right = convertToMathExpr(mathExpr.right, negated);
    let operation: string = mathExpr.op;
    return new TLBBinaryOp(left, right, operation);
  }
  if (mathExpr instanceof NegateExpr) {
    if (
      mathExpr.expr instanceof MathExpr ||
      mathExpr.expr instanceof NameExpr ||
      mathExpr.expr instanceof NumberExpr
    ) {
      let expression = convertToMathExpr(mathExpr.expr, true);
      if (expression instanceof TLBBinaryOp) {
        return new TLBBinaryOp(
          expression.left,
          expression.right,
          expression.operation,
          expression.variables,
          true
        );
      }
      if (expression instanceof TLBVarExpr) {
        return new TLBVarExpr(expression.x, expression.variables, true);
      }
      if (expression instanceof TLBNumberExpr) {
        return new TLBNumberExpr(expression.n, expression.variables, true);
      }
    }
  }
  throw new Error(`Could not convert expression: ${mathExpr}`);
}
