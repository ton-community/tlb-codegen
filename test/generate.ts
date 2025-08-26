import path from 'path';

import { generateCode } from '../src/node';

function genCodeForTest(name: string) {
    const fixturesDir = path.resolve(__dirname, 'tlb');
    generateCode(
        path.resolve(fixturesDir, name + '.tlb'),
        'test/generated_files/generated_' + name + '.ts',
        'typescript',
    );
}

genCodeForTest('block');
genCodeForTest('test');
