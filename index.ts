import { generateCode } from "./src/main";
export * from "./src/ast";
export { generateCode, getTLBCode, getTLBCodeByAST, generateCodeByAST, generateCodeWithGenerator } from "./src/main";
export { isBigInt as isBigIntForJson, isBigIntExpr as isBigIntExprForJson } from "./src/generators/typescript/utils";
export { CodeGenerator } from "./src/generators/generator";
export { TypescriptGenerator } from "./src/generators/typescript/generator";