import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse } from './src'
import { ast } from './src'
import { generate } from './src/codegen/main'
import { Program } from './src/ast/nodes'


const fixturesDir = path.resolve(__dirname, 'tests/fixtures')

function generateCode(filename: string) {
    const input = fs.readFileSync(
      path.resolve(fixturesDir, 'tlb', filename + '.tlb'),
      'utf-8',
    )
    const parsed = parse(input)

    const tree = ast(input)

    fs.writeFile('generated_' + filename + '.ts', generate(tree), () => { });
}

generateCode('test')
generateCode('my')
generateCode('block')