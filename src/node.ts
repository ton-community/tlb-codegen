import fs from 'fs/promises';

import { ast } from '@ton-community/tlb-parser';

import { TLBCode } from './ast';
import { CodeGenerator } from './generators/generator';
import { generateCodeByAST, getGenerator, getTLBCodeByAST } from './main';

export async function getTLBCode(inputPath: string) {
    const input = await fs.readFile(inputPath, 'utf-8');

    const tree = ast(input);

    return getTLBCodeByAST(tree, input);
}

export async function generateCodeWithGenerator(
    inputPath: string,
    outputPath: string,
    getGenerator: (tlbCode: TLBCode) => CodeGenerator,
) {
    const input = await fs.readFile(inputPath, 'utf-8');

    const tree = ast(input);

    await fs.writeFile(outputPath, generateCodeByAST(tree, input, getGenerator), {});
    // eslint-disable-next-line no-console
    console.log(`Generated code is saved to ${outputPath}`);
}

export async function generateCode(inputPath: string, outputPath: string, resultLanguage: string) {
    return generateCodeWithGenerator(inputPath, outputPath, getGenerator(resultLanguage));
}
