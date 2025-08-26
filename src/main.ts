import { ast, Program } from '@ton-community/tlb-parser';

import { TLBCode, TLBType } from './ast';
import { TLBCodeBuild, TLBTypeBuild } from './astbuilder/utils';
import { convertCodeToReadonly } from './astbuilder/fill_constructors';
import { fillConstructors } from './astbuilder/fill_constructors';
import { CodeBuilder } from './generators/CodeBuilder';
import { CodeGenerator, CommonGenDeclaration } from './generators/generator';
import { TypescriptGenerator } from './generators/typescript/generator';

export function getTLBCodeByAST(tree: Program, input: string): TLBCode {
    let oldTlbCode: TLBCodeBuild = { types: new Map<string, TLBTypeBuild>() };
    let splittedInput = input.split('\n');
    fillConstructors(tree.declarations, oldTlbCode, splittedInput);
    return convertCodeToReadonly(oldTlbCode);
}

export function generateCodeByAST(tree: Program, input: string, getGenerator: (tlbCode: TLBCode) => CodeGenerator) {
    let tlbCode = getTLBCodeByAST(tree, input);
    let codeGenerator: CodeGenerator = getGenerator(tlbCode);

    codeGenerator.addTonCoreClassUsage('Builder');
    codeGenerator.addTonCoreClassUsage('Slice');
    codeGenerator.addTonCoreClassUsage('beginCell');
    codeGenerator.addTonCoreClassUsage('BitString');
    codeGenerator.addTonCoreClassUsage('Cell');
    codeGenerator.addTonCoreClassUsage('Address');
    codeGenerator.addTonCoreClassUsage('ExternalAddress');
    codeGenerator.addTonCoreClassUsage('Dictionary');
    codeGenerator.addTonCoreClassUsage('DictionaryValue');
    codeGenerator.addTonCoreClassUsage('TupleItem');
    codeGenerator.addTonCoreClassUsage('parseTuple');
    codeGenerator.addTonCoreClassUsage('serializeTuple');

    codeGenerator.addBuiltinCode();

    let jsCodeDeclarations: CommonGenDeclaration[] = [];
    codeGenerator.jsCodeDeclarations.forEach((declaration) => {
        jsCodeDeclarations.push(declaration);
    });

    tlbCode.types.forEach((tlbType: TLBType) => {
        codeGenerator.addTlbType(tlbType);
    });

    let generatedCode = '';

    codeGenerator.jsCodeConstructorDeclarations.forEach((element) => {
        jsCodeDeclarations.push(element);
    });

    codeGenerator.jsCodeFunctionsDeclarations.forEach((element) => {
        jsCodeDeclarations.push(element);
    });

    jsCodeDeclarations.forEach((element) => {
        generatedCode += codeGenerator.toCode(element, new CodeBuilder()).render() + '\n';
    });

    return generatedCode;
}

export function getGenerator(resultLanguage: string) {
    return (tlbCode: TLBCode) => {
        if (resultLanguage == 'typescript') {
            return new TypescriptGenerator(tlbCode);
        } else {
            throw new Error(`Result language ${resultLanguage} is not supported`);
        }
    };
}

export async function generateCodeFromData(input: string, resultLanguage: string): Promise<string> {
    const tree = ast(input);
    return generateCodeByAST(tree, input, getGenerator(resultLanguage));
}
