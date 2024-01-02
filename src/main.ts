import { Program } from "@igorivaniuk/tlb-parser/dist/ast/nodes";
import { TLBCode, TLBType } from "./ast";
import {
  TLBCodeBuild,
  TLBTypeBuild,
  convertCodeToReadonly,
  fillConstructors,
} from "./astbuilder/utils";
import { CodeBuilder } from "./generators/CodeBuilder";
import { CodeGenerator, CommonGenDeclaration } from "./generators/generator";
import { TypescriptGenerator } from "./generators/typescript/generator";

export function generate(tree: Program, input: string) {
  let oldTlbCode: TLBCodeBuild = { types: new Map<string, TLBTypeBuild>() };

  let splittedInput = input.split("\n");

  fillConstructors(tree.declarations, oldTlbCode, splittedInput);
  let tlbCode: TLBCode = convertCodeToReadonly(oldTlbCode);

  let codeGenerator: CodeGenerator = new TypescriptGenerator(tlbCode);

  codeGenerator.addTonCoreClassUsage("Builder");
  codeGenerator.addTonCoreClassUsage("Slice");
  codeGenerator.addTonCoreClassUsage("beginCell");
  codeGenerator.addTonCoreClassUsage("BitString");
  codeGenerator.addTonCoreClassUsage("Cell");
  codeGenerator.addTonCoreClassUsage("Address");

  codeGenerator.addBitLenFunction();

  let jsCodeDeclarations: CommonGenDeclaration[] = [];
  codeGenerator.jsCodeDeclarations.forEach((declaration) => {
    jsCodeDeclarations.push(declaration);
  });

  tlbCode.types.forEach((tlbType: TLBType) => {
    codeGenerator.addTlbType(tlbType);
  });

  let generatedCode = "";

  codeGenerator.jsCodeConstructorDeclarations.forEach((element) => {
    jsCodeDeclarations.push(element);
  });

  codeGenerator.jsCodeFunctionsDeclarations.forEach((element) => {
    jsCodeDeclarations.push(element);
  });

  jsCodeDeclarations.forEach((element) => {
    generatedCode +=
      codeGenerator.toCode(element, new CodeBuilder()).render() + "\n";
  });

  return generatedCode;
}
