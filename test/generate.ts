import path from 'path';
import fs from 'fs/promises';

import { generateCode } from '../src';

export async function genCodeForTest(name: string) {
    const fixturesDir = path.resolve(__dirname, 'tlb');
    const tlb = await fs.readFile(path.resolve(fixturesDir, name + '.tlb'), 'utf-8');
    const code = generateCode(tlb, 'typescript');
    const output = path.resolve(__dirname, 'generated_files/generated_' + name + '.ts');
    await fs.writeFile(output, code, {});
}
