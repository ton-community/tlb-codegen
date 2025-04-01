import {
  BuiltinOneArgExpr,
  BuiltinZeroArgs,
  CellRefExpr,
  CombinatorExpr,
  CompareExpr,
  CondExpr,
  Declaration,
  Expression,
  FieldAnonymousDef,
  FieldBuiltinDef,
  FieldCurlyExprDef,
  FieldDefinition,
  FieldExprDef,
  FieldNamedDef,
  MathExpr,
  NameExpr,
  NegateExpr,
  NumberExpr,
} from "@ton-community/tlb-parser";
import {
  TLBBinaryOp,
  TLBCode,
  TLBConstructor,
  TLBConstructorTag,
  TLBField,
  TLBMathExpr,
  TLBNumberExpr,
  TLBParameter,
  TLBType,
  TLBVarExpr,
  TLBVariable,
} from "../ast";
import { crc32, findNotReservedName } from "../utils";
import { fillFields } from "./handle_field";
import {
  TLBCodeBuild,
  TLBConstructorBuild,
  TLBParameterBuild,
  TLBTypeBuild,
  TLBVariableBuild,
  calculateVariable,
  convertToMathExpr,
  deriveMathExpression,
  getNegatedVariable,
  opCodeSetsEqual,
  reorganizeExpression,
} from "./utils";

export function fillConstructors(
  declarations: Declaration[],
  tlbCode: TLBCodeBuild,
  input: string[]
) {
  let typeDeclarations = new Map<
    String,
    { declaration: Declaration; constructor: TLBConstructorBuild }[]
  >();
  declarations.forEach((declaration) => {
    let tlbType: TLBTypeBuild | undefined = tlbCode.types.get(
      declaration.combinator.name
    );
    if (tlbType == undefined) {
      tlbType = { name: declaration.combinator.name, constructors: [] };
    }
    let constructor = {
      parameters: [],
      parametersMap: new Map<string, TLBParameterBuild>(),
      name: declaration.constructorDef.name,
      variables: new Array<TLBVariableBuild>(),
      variablesMap: new Map<string, TLBVariableBuild>(),
      tag: getConstructorTag(declaration, input),
      constraints: [],
      fields: [],
      declaration: "",
      tlbType: tlbType.name,
    };
    tlbType.constructors.push(constructor);
    tlbCode.types.set(tlbType.name, tlbType);

    let currentDecls = typeDeclarations.get(tlbType.name);
    if (!currentDecls) {
      currentDecls = [];
    }
    currentDecls.push({ declaration: declaration, constructor: constructor });
    typeDeclarations.set(tlbType.name, currentDecls);
  });

  tlbCode.types.forEach((tlbType: TLBTypeBuild) => {
    typeDeclarations.get(tlbType.name)?.forEach((typeItem) => {
      let declaration = typeItem.declaration;
      let constructor = typeItem.constructor;

      declaration.fields.forEach((field) => {
        if (field instanceof FieldBuiltinDef) {
          constructor.variables.push({
            name: field.name,
            isConst: false,
            negated: false,
            type: field.type,
            calculated: false,
            isField: false,
          });
        }
        if (field instanceof FieldNamedDef) {
          constructor.variables.push({
            name: field.name,
            isConst: false,
            negated: false,
            type: "#",
            calculated: false,
            isField: true,
          });
        }
      });
      constructor.variables.forEach((variable) => {
        if (variable.name) {
          constructor.variablesMap.set(variable.name, variable);
        }
      });
      let argumentIndex = -1;
      declaration.combinator.args.forEach((element) => {
        argumentIndex++;
        let parameter: TLBParameterBuild | undefined = undefined;
        if (element instanceof NameExpr) {
          let variable = constructor.variablesMap.get(element.name);
          if (variable) {
            if (variable.type == "#") {
              variable.deriveExpr = new TLBVarExpr(element.name);
              variable.initialExpr = variable.deriveExpr;
            }
            parameter = {
              variable: variable,
              paramExpr: new TLBVarExpr(element.name),
            };
          } else {
            throw new Error(
              "Field not known before using (should be tagged as implicit): " +
              element
            );
          }
        } else if (element instanceof MathExpr) {
          let derivedExpr = deriveMathExpression(element);
          if (!derivedExpr.name) {
            throw new Error(`Expression should contain variable ${element}`);
          }
          let variable = constructor.variablesMap.get(derivedExpr.name);
          if (variable && variable.name) {
            parameter = { variable: variable, paramExpr: derivedExpr.derived };
            parameter.argName = "arg" + argumentIndex;
            parameter.variable.deriveExpr = reorganizeWithArg(
              convertToMathExpr(element),
              parameter.argName,
              variable.name
            );
            parameter.variable.initialExpr = new TLBVarExpr(variable.name);
          } else {
            throw new Error(`Variable should have name ${variable}`);
          }
        } else if (
          element instanceof NegateExpr &&
          (element.expr instanceof MathExpr ||
            element.expr instanceof NumberExpr ||
            element.expr instanceof NameExpr)
        ) {
          let derivedExpr = deriveMathExpression(element.expr);
          let toBeConst = false;
          if (element.expr instanceof NumberExpr) {
            toBeConst = true;
          }

          if (derivedExpr.name == undefined) {
            if (toBeConst) {
              parameter = {
                variable: {
                  negated: true,
                  isConst: toBeConst,
                  type: "#",
                  name: undefined,
                  deriveExpr: derivedExpr.derived,
                  initialExpr: derivedExpr.derived,
                  calculated: false,
                  isField: false,
                },
                paramExpr: derivedExpr.derived,
              };
            } else {
              throw new Error("Cannot identify combinator arg " + element);
            }
          } else {
            let variable = constructor.variablesMap.get(derivedExpr.name);
            if (variable) {
              variable.negated = true;
              variable.isConst = toBeConst;
              variable.initialExpr = derivedExpr.derived;
              parameter = {
                variable: variable,
                paramExpr: derivedExpr.derived,
              };
            } else {
              throw new Error("Cannot identify combinator arg " + element);
            }
          }
        } else if (element instanceof NumberExpr) {
          parameter = {
            variable: {
              negated: false,
              isConst: true,
              type: "#",
              name: undefined,
              deriveExpr: new TLBNumberExpr(element.num),
              initialExpr: new TLBNumberExpr(element.num),
              calculated: false,
              isField: false,
            },
            paramExpr: new TLBNumberExpr(element.num),
          };
        } else {
          throw new Error("Cannot identify combinator arg: " + element);
        }
        constructor.parameters.push(parameter);
        if (parameter.variable.name != undefined) {
          constructor.parametersMap.set(parameter.variable.name, parameter);
        }
      });
      constructor.declaration = getStringDeclaration(declaration, input);
      fillConstraintsAndNegationVars(constructor, declaration);
      fillFields(typeItem, tlbType);
      calculateVariables(constructor);
    });
    fillParameterNames(tlbType);
    fillArgNames(tlbType);
    findConstructorsNaming(tlbType);
    tlbType.constructors.sort(compareConstructors);
  });
  checkAndRemovePrimitives(tlbCode, input, typeDeclarations);
  findAvailableVarNamesForCode(tlbCode);
}
function fillConstraintsAndNegationVars(
  constructor: TLBConstructorBuild,
  declaration: Declaration
) {
  declaration.fields.forEach((field) => {
    if (
      field instanceof FieldCurlyExprDef &&
      field.expr instanceof CompareExpr
    ) {
      if (field.expr.op == "=") {
        let myMathExpr = convertToMathExpr(field.expr);
        let negatedVariable = getNegatedVariable(myMathExpr);
        if (negatedVariable) {
          myMathExpr = reorganizeExpression(myMathExpr, negatedVariable);
          if (myMathExpr instanceof TLBBinaryOp) {
            myMathExpr = myMathExpr.right;
          }
          let variable = constructor.variablesMap.get(negatedVariable);
          if (variable) {
            variable.negated = true;
            variable.deriveExpr = myMathExpr;
          } else {
            throw new Error(`Variable ${negatedVariable} not defined`);
          }
        } else {
          constructor.constraints.push(myMathExpr);
        }
      } else {
        constructor.constraints.push(convertToMathExpr(field.expr));
      }
    }
  });
}
function fillParameterNames(tlbType: TLBTypeBuild) {
  let parameterNames: (string | undefined)[] = [];
  tlbType.constructors[0]?.parameters.forEach((element) => {
    parameterNames.push(element.variable.name);
  });
  tlbType.constructors.forEach((constructor) => {
    for (let i = 0; i < constructor.parameters.length; i++) {
      if (parameterNames[i] == undefined) {
        let parameterName = constructor.parameters[i]?.variable.name;
        if (parameterName != undefined) {
          parameterNames[i] = parameterName;
        }
      }
    }
  });
  for (let i = 0; i < parameterNames.length; i++) {
    if (parameterNames[i] == undefined) {
      parameterNames[i] = "arg" + i;
    }
  }
  tlbType.constructors.forEach((constructor) => {
    for (let i = 0; i < constructor.parameters.length; i++) {
      let parameterName = parameterNames[i];
      if (
        parameterName != undefined &&
        constructor.parameters[i]?.variable.name == undefined
      ) {
        constructor.parameters[i]!.variable.name = parameterName;
      }
    }
  });
}
function fillArgNames(tlbType: TLBTypeBuild) {
  let argNames: (string | undefined)[] = [];
  tlbType.constructors[0]?.parameters.forEach((element) => {
    argNames.push(undefined);
  });

  tlbType.constructors.forEach((constructor) => {
    for (let i = 0; i < constructor.parameters.length; i++) {
      let argName = constructor.parameters[i]?.argName;
      if (argName) {
        argNames[i] = argName;
      }
    }
  });
  tlbType.constructors.forEach((constructor) => {
    for (let i = 0; i < constructor.parameters.length; i++) {
      let argName = argNames[i];
      let parameter = constructor.parameters[i];
      if (argName != undefined && parameter != undefined) {
        parameter.argName = argName;
        if (parameter.paramExpr instanceof TLBVarExpr) {
          parameter.variable.deriveExpr = new TLBVarExpr(parameter.argName);
          parameter.paramExpr = parameter.variable.deriveExpr;
        }
      }
    }
  });
}
function compareConstructors(
  a: TLBConstructorBuild,
  b: TLBConstructorBuild
): number {
  let aPriority = constructorPriority(a);
  let bPriority = constructorPriority(b);
  if (aPriority < bPriority) {
    return 1;
  }
  if (aPriority > bPriority) {
    return -1;
  }
  return 0;
}
function constructorPriority(c: TLBConstructorBuild): number {
  let result = 0;
  if (c.tag.bitLen > 0) {
    result++;
  }
  c.parameters.forEach((parameter) => {
    if (parameter.variable.isConst) {
      result++;
    }
  });
  return result;
}
function reorganizeWithArg(
  mathExpr: TLBMathExpr,
  argName: string,
  varName: string
): TLBMathExpr {
  let reorganized = reorganizeExpression(
    new TLBBinaryOp(
      new TLBVarExpr(argName),
      mathExpr,
      "=",
      new Set<string>(),
      false
    ),
    varName
  );
  if (reorganized instanceof TLBBinaryOp) {
    return reorganized.right;
  }
  throw new Error(`Couldn't reorganize expression ${mathExpr}`);
}
function getConstructorTag(
  declaration: Declaration,
  input: string[]
): TLBConstructorTag {
  let tag = declaration.constructorDef.tag;
  if (
    (tag == null && declaration.constructorDef.name == "_") ||
    (tag && tag.length > 1 && tag[1] == "_")
  ) {
    return {
      bitLen: 0,
      binary: "",
    };
  }
  if (tag == null) {
    let calculatedTag = calculateTag(declaration);
    return {
      bitLen: 32,
      binary: "0x" + calculatedTag,
    };
  }
  if (tag[0] == "$") {
    return {
      bitLen: tag?.length - 1,
      binary: "0b" + tag.slice(1),
    };
  }
  if (tag[0] == "#") {
    const hasTrailingUnderscore = tag.endsWith("_");
    const hexPart = tag.slice(1, hasTrailingUnderscore ? -1 : undefined);
    if (hasTrailingUnderscore) {
      const binary = parseInt(hexPart, 16).toString(2).padStart(hexPart.length * 4, '0');
      const truncatedBinary = binary.slice(0, -1);
      const truncatedHex = parseInt(truncatedBinary, 2).toString(16).padStart(Math.ceil(truncatedBinary.length / 4), '0');
      return {
        bitLen: truncatedBinary.length,
        binary: "0x" + truncatedHex,
      };
    }
    return {
      bitLen: hexPart.length * 4,
      binary: "0x" + hexPart,
    };
  }
  throw new Error("Unknown tag " + tag);
}
function findConstructorsNaming(tlbType: TLBTypeBuild) {
  let constructorNames: Set<string> = new Set<string>();
  let constructorIndex = 0;
  tlbType.constructors.forEach((current) => {
    while (constructorNames.has(current.name)) {
      current.name += constructorIndex.toString();
    }
    constructorNames.add(current.name);
    constructorIndex++;
  });
}
function checkAndRemovePrimitives(
  tlbCode: TLBCodeBuild,
  input: string[],
  typeDeclarations: Map<
    String,
    { declaration: Declaration; constructor: TLBConstructorBuild }[]
  >
) {
  let toDelete: string[] = [];

  let typesToDelete = new Map<string, string[]>();
  typesToDelete.set("Bool", ["b814e002", "e95dd78d"]);
  typesToDelete.set("MsgAddressInt", ["9bb90082", "ca70d9f6"]);
  typesToDelete.set("Bit", ["12acf7f6"])
  typesToDelete.set("Grams", ["31468450"])
  typesToDelete.set("MsgAddressExt", ["9ccb7139", "ee7b72a3"])
  typesToDelete.set("MsgAddress", ["21d0382b", "e06aa05e"])
  typesToDelete.set("VarUInteger", ["988e36b3"])
  typesToDelete.set("VarInteger", ["225aaee0"])
  typesToDelete.set("HashmapE", ["1cc05be9", "40b92161"])
  typesToDelete.set("HashmapAugE", ["af55dae6", "e135d248"])
  typesToDelete.set("BoolTrue", ["b5311773"])
  typesToDelete.set("BoolFalse", ["f3214771"])

  typesToDelete.forEach((opCodesExpected: string[], typeName: string) => {
    let typeItems = typeDeclarations.get(typeName);
    if (typeItems) {
      let opCodesActual: string[] = [];
      typeItems.forEach((typeItem) => {
        opCodesActual.push(calculateTag(typeItem.declaration));
      });
      if (!opCodeSetsEqual(opCodesExpected, opCodesActual)) {
        throw new Error("Bool primitive type is not correct in scheme");
      }
      toDelete.push(typeName);
    }
  });

  toDelete.forEach((name: string) => {
    tlbCode.types.delete(name);
  });
}
function findAvailableVarNamesForCode(tlbCode: TLBCodeBuild) {
  tlbCode.types.forEach((tlbType) => {
    tlbType.constructors.forEach((constructor) => {
      let variablesSet = new Set<string>();
      findAvailableFieldsNames(constructor.fields, variablesSet);
    });
  });
}
function findAvailableFieldsNames(
  fields: TLBField[],
  variablesSet: Set<string>
) {
  fields.forEach((field) => {
    if (field.subFields.length == 0) {
      findAvailableFieldName(field, variablesSet);
    }
    findAvailableFieldsNames(field.subFields, variablesSet);
  });
}
function findAvailableFieldName(field: TLBField, variablesSet: Set<string>) {
  let index = 0;
  field.name = findNotReservedName(field.name);
  while (variablesSet.has(field.name)) {
    field.name = findNotReservedName(field.name + "_" + index);
    index++;
  }
  variablesSet.add(field.name);
}
export function convertCodeToReadonly(tlbCode: TLBCodeBuild): TLBCode {
  let newTypes = new Map<string, TLBType>();
  tlbCode.types.forEach((value, key) => {
    let newConstructors = new Array<TLBConstructor>();
    value.constructors.forEach((value) => {
      let newVariablesMap = new Map<string, TLBVariable>();
      value.variablesMap.forEach((value, key) => {
        newVariablesMap.set(key, convertVariableToReadonly(value));
      });
      let newParametersMap = new Map<string, TLBParameter>();
      value.parametersMap.forEach((value, key) => {
        newParametersMap.set(key, convertParameterToReadonly(value));
      });
      let newConstructor = new TLBConstructor(
        value.parameters.map(convertParameterToReadonly),
        value.variables.map(convertVariableToReadonly),
        newVariablesMap,
        newParametersMap,
        value.name,
        value.fields,
        value.tag,
        value.constraints,
        value.declaration,
        value.tlbType
      );
      newConstructors.push(newConstructor);
    });
    let newType = new TLBType(value.name, newConstructors);
    newTypes.set(key, newType);
  });
  return new TLBCode(newTypes);
}
function convertParameterToReadonly(
  tlbParameter: TLBParameterBuild
): TLBParameter {
  return new TLBParameter(
    convertVariableToReadonly(tlbParameter.variable),
    tlbParameter.paramExpr,
    tlbParameter.argName
  );
}
function convertVariableToReadonly(tlbVariable: TLBVariableBuild): TLBVariable {
  if (tlbVariable.name == undefined) {
    throw new Error("Variable is undefined");
  }
  return new TLBVariable(
    tlbVariable.isConst,
    tlbVariable.negated,
    tlbVariable.type,
    tlbVariable.name,
    tlbVariable.isField,
    tlbVariable.deriveExpr,
    tlbVariable.initialExpr
  );
}
function getStringDeclaration(
  declaration: Declaration,
  input: string[]
): string {
  let result = "";
  let splittedInput = input;
  let currentLine = declaration.locations.line - 1;
  let currentColumn = 0;
  while (!splittedInput[currentLine]?.includes(";")) {
    result += splittedInput[currentLine]?.substring(currentColumn) + "\n";
    currentLine++;
    currentColumn = 0;
  }
  let currentInput = splittedInput[currentLine];
  if (currentInput) {
    result += currentInput.substring(
      currentColumn,
      currentInput.indexOf(";") + 1
    );
  }
  return result;
}
function calculateVariables(constructor: TLBConstructorBuild) {
  constructor.variables.forEach((variable) => {
    calculateVariable(variable, constructor);
  });
  constructor.parameters.forEach((parameter) => {
    calculateVariable(parameter.variable, constructor);
  });
}

const TypeGuards = {
  isFieldBuiltinDef: (field: FieldDefinition): field is FieldBuiltinDef =>
    field instanceof FieldBuiltinDef,

  isFieldCurlyExprDef: (field: FieldDefinition): field is FieldCurlyExprDef =>
    field instanceof FieldCurlyExprDef,

  isFieldAnonymousDef: (field: FieldDefinition): field is FieldAnonymousDef =>
    field instanceof FieldAnonymousDef,

  isFieldNamedDef: (field: FieldDefinition): field is FieldNamedDef =>
    field instanceof FieldNamedDef,

  isFieldExprDef: (field: FieldDefinition): field is FieldExprDef =>
    field instanceof FieldExprDef,

  isCompareExpr: (expr: Expression): expr is CompareExpr =>
    expr instanceof CompareExpr,

  isMathExpr: (expr: Expression): expr is MathExpr =>
    expr instanceof MathExpr,

  isNegateExpr: (expr: Expression): expr is NegateExpr =>
    expr instanceof NegateExpr,

  isNameExpr: (expr: Expression): expr is NameExpr =>
    expr instanceof NameExpr,

  isNumberExpr: (expr: Expression): expr is NumberExpr =>
    expr instanceof NumberExpr,

  isCellRefExpr: (expr: Expression): expr is CellRefExpr =>
    expr instanceof CellRefExpr,

  isBuiltinZeroArgs: (expr: Expression): expr is BuiltinZeroArgs =>
    expr instanceof BuiltinZeroArgs,

  isBuiltinOneArgExpr: (expr: Expression): expr is BuiltinOneArgExpr =>
    expr instanceof BuiltinOneArgExpr,

  isCombinatorExpr: (expr: Expression): expr is CombinatorExpr =>
    expr instanceof CombinatorExpr,

  isCondExpr: (expr: Expression): expr is CondExpr =>
    expr instanceof CondExpr
};

function calculateTag(declaration: Declaration): string {
  const formattedDeclaration = formatDeclaration(declaration);

  const encoder = new TextEncoder();
  return crc32(encoder.encode(formattedDeclaration)).toString(16);
}

function isImplicitOrConstraint(field: FieldDefinition): boolean {
  const { isFieldBuiltinDef, isFieldCurlyExprDef, isFieldNamedDef,
    isFieldExprDef, isCompareExpr } = TypeGuards;

  if (isFieldBuiltinDef(field) || isFieldCurlyExprDef(field)) {
    return true;
  }

  if ((isFieldNamedDef(field) || isFieldExprDef(field)) &&
    isCompareExpr(field.expr) &&
    field.expr.op === "=") {
    return true;
  }

  return false;
}

function formatDeclaration(declaration: Declaration): string {
  const parts: string[] = [declaration.constructorDef.name];

  declaration.fields.forEach(field => {
    parts.push(formatField(field));
  });

  parts.push("=", declaration.combinator.name);

  declaration.combinator.args.forEach(arg => {
    parts.push(formatExpression(arg));
  });

  return parts.join(" ");
}

function formatField(field: FieldDefinition): string {
  const { isFieldBuiltinDef, isFieldCurlyExprDef, isFieldNamedDef,
    isFieldExprDef, isFieldAnonymousDef } = TypeGuards;

  const parts: string[] = [];

  if (isImplicitOrConstraint(field)) {
    if ((isFieldBuiltinDef(field) || isFieldNamedDef(field) ||
      (isFieldAnonymousDef(field)) && field.name)) {
      parts.push(`${field.name}:`);
    }

    if (isFieldBuiltinDef(field)) {
      parts.push(field.type);
    } else if (isFieldCurlyExprDef(field)) {
      parts.push(formatExpression(field.expr));
    } else if (isFieldNamedDef(field)) {
      parts.push(formatExpression(field.expr));
    } else if (isFieldExprDef(field)) {
      parts.push(formatExpression(field.expr));
    } else if (isFieldAnonymousDef(field)) {
      parts.push(formatAnonymousField(field));
    }

    return parts.join("");
  }

  if (isFieldNamedDef(field)) {
    parts.push(`${field.name}:`);
  } else if (isFieldAnonymousDef(field) && field.name) {
    parts.push(`${field.name}:`);
  }

  if (isFieldNamedDef(field)) {
    parts.push(formatExpression(field.expr));
  } else if (isFieldExprDef(field)) {
    parts.push(formatExpression(field.expr));
  } else if (isFieldAnonymousDef(field)) {
    parts.push(formatAnonymousField(field));
  }


  return parts.join("");
}

function formatAnonymousField(field: FieldAnonymousDef): string {
  const innerFields = field.fields.map((innerField, index) =>
    index > 0 ? " " + formatField(innerField) : formatField(innerField)
  ).join("");

  return `${field.isRef ? "^[ " : "[ "}${innerFields} ]`;
}

function formatExpression(expr: Expression): string {
  const {
    isCompareExpr, isMathExpr, isNegateExpr, isNameExpr, isNumberExpr,
    isCellRefExpr, isBuiltinZeroArgs, isBuiltinOneArgExpr, isCombinatorExpr, isCondExpr
  } = TypeGuards;


  if (isCompareExpr(expr)) {
    return `${expr.op} ${formatExpression(expr.left)} ${formatExpression(expr.right)}`;
  }

  if (isMathExpr(expr)) {
    return formatMathExpr(expr);
  }

  if (isNegateExpr(expr)) {
    return "~" + formatExpression(expr.expr);
  }

  if (isNumberExpr(expr)) {
    return String(expr.num);
  }

  if (isNameExpr(expr)) {
    return expr.name;
  }

  if (isCellRefExpr(expr)) {
    return "^" + formatExpression(expr.expr);
  }

  if (isBuiltinZeroArgs(expr)) {
    return expr.name;
  }

  if (isBuiltinOneArgExpr(expr)) {
    return `${expr.name} ${formatExpression(expr.arg)}`;
  }

  if (isCombinatorExpr(expr)) {
    const args = expr.args.map(arg => formatExpression(arg)).join(" ");
    return `${expr.name} ${args}`;
  }

  if (isCondExpr(expr)) {
    let result = formatExpression(expr.left);

    if (expr.dotExpr !== null) {
      result += "." + expr.dotExpr;
    }

    result += "?" + formatExpression(expr.condExpr);
    return result;
  }

  return String(expr);
}

function formatMathExpr(expr: MathExpr): string {
  const { isNumberExpr } = TypeGuards;

  if (expr.op === "+") {
    return `${formatExpression(expr.left)} + ${formatExpression(expr.right)}`;
  }

  if (expr.op === "*") {
    if (isNumberExpr(expr.right) && !isNumberExpr(expr.left)) {
      return `${formatExpression(expr.right)} * ${formatExpression(expr.left)}`;
    }

    if (isNumberExpr(expr.left) && isNumberExpr(expr.right)) {
      return String(expr.left.num * expr.right.num);
    }

    return `${formatExpression(expr.left)} * ${formatExpression(expr.right)}`;
  }

  return `${formatExpression(expr.left)} ${expr.op} ${formatExpression(expr.right)}`;
}
