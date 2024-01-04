import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse, ast } from '@igorivaniuk/tlb-parser'
import { generate } from './src/main'


const fixturesDir = path.resolve(__dirname, 'test')

function generateCode(filename: string) {
  const input = fs.readFileSync(
    path.resolve(fixturesDir, 'tlb', filename + '.tlb'),
    'utf-8',
  )
  const parsed = parse(input)

  const tree = ast(input)

  fs.writeFile('test/generated_files/generated_' + filename + '.ts', generate(tree, input), () => { });
}

generateCode('block')
generateCode('test')
