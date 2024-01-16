import { Program } from "@igorivaniuk/tlb-parser/dist/ast/nodes";
import { TLBCode, TLBType } from "./ast";
import {
  TLBCodeBuild,
  TLBTypeBuild,
} from "./astbuilder/utils";
import { convertCodeToReadonly } from "./astbuilder/fill_constructors";
import { fillConstructors } from "./astbuilder/fill_constructors";
import { CodeBuilder } from "./generators/CodeBuilder";
import { CodeGenerator, CommonGenDeclaration } from "./generators/generator";
import { TypescriptGenerator } from "./generators/typescript/generator";

import { ast } from '@igorivaniuk/tlb-parser'
import fs from 'fs'


export function generateCodeByAST(tree: Program, input: string, getGenerator: (tlbCode: TLBCode) => CodeGenerator) {
  let oldTlbCode: TLBCodeBuild = { types: new Map<string, TLBTypeBuild>() };

  let splittedInput = input.split("\n");

  fillConstructors(tree.declarations, oldTlbCode, splittedInput);
  let tlbCode: TLBCode = convertCodeToReadonly(oldTlbCode);

  let codeGenerator: CodeGenerator = getGenerator(tlbCode);

  codeGenerator.addTonCoreClassUsage("Builder");
  codeGenerator.addTonCoreClassUsage("Slice");
  codeGenerator.addTonCoreClassUsage("beginCell");
  codeGenerator.addTonCoreClassUsage("BitString");
  codeGenerator.addTonCoreClassUsage("Cell");
  codeGenerator.addTonCoreClassUsage("Address");
  codeGenerator.addTonCoreClassUsage("ExternalAddress");
  codeGenerator.addTonCoreClassUsage("Dictionary")
  codeGenerator.addTonCoreClassUsage("DictionaryValue")

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

export function generateCodeWithGenerator(inputPath: string, outputPath: string, getGenerator: (tlbCode: TLBCode) => CodeGenerator) {
  const input = fs.readFileSync(
    inputPath,
    'utf-8',
  )

  const tree = ast(input)

  fs.writeFile(outputPath, generateCodeByAST(tree, input, getGenerator), () => { });
}

export function generateCode(inputPath: string, outputPath: string, resultLanguage: string) {
  let getGenerator = (tlbCode: TLBCode) => {
    if (resultLanguage == 'typescript') {
      return new TypescriptGenerator(tlbCode)
    } else {
      throw new Error(`Result language ${resultLanguage} is not supported`)
    }
  }
  generateCodeWithGenerator(inputPath, outputPath, getGenerator);
}