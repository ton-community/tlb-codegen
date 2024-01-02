import { TLBConstructor, TLBType } from "./ast";
import { TLBConstructorBuild, TLBTypeBuild } from "./astbuilder/utils";

export function firstLower(structName: String) {
  return structName.charAt(0).toLowerCase() + structName.slice(1);
}

export function getCurrentSlice(slicePrefix: number[], name: string): string {
  let result = name;
  slicePrefix = slicePrefix.slice(0, slicePrefix.length - 1);
  slicePrefix.forEach((element) => {
    result += element.toString();
  });
  if (result == "cell") {
    return "builder";
  }
  return result;
}

export function bitLen(n: number) {
  return n.toString(2).length;
}

export function isNameReserved(name: string): boolean {
  let tsReserved = [
    "abstract",
    "arguments",
    "await",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "double",
    "else",
    "enum",
    "eval",
    "export",
    "extends",
    "false",
    "final",
    "finally",
    "float",
    "for",
    "function",
    "goto",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "int",
    "interface",
    "let",
    "long",
    "native",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "volatile",
    "while",
    "with",
    "yield",
  ];
  if (tsReserved.includes(name)) {
    return true;
  }
  if (name.startsWith("slice")) {
    return true;
  }
  if (name.startsWith("cell")) {
    return true;
  }
  if (name == "builder") {
    return true;
  }
  return false;
}
export function findNotReservedName(
  name: string,
  possibleSuffix: string = "0"
): string {
  if (name.startsWith("slice") || name.startsWith("cell")) {
    name = "_" + name;
  }
  while (isNameReserved(name)) {
    name += possibleSuffix;
  }
  return name;
}
export function getSubStructName(
  tlbType: TLBType | TLBTypeBuild,
  constructor: TLBConstructorBuild | TLBConstructor
): string {
  if (tlbType.constructors.length > 1) {
    return tlbType.name + "_" + constructor.name;
  } else {
    return tlbType.name;
  }
}
