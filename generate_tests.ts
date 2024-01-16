import path from 'path'
import util from 'util'
import { generateCode } from './src/main'

function genCodeForTest(name: string) {
  const fixturesDir = path.resolve(__dirname, 'test')
  generateCode(path.resolve(fixturesDir, 'tlb', name + '.tlb'), 'test/generated_files/generated_' + name + '.ts', 'typescript')
}

genCodeForTest('block')
genCodeForTest('test')
