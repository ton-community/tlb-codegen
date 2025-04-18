import path from 'path'
import util from 'util'
import { generateCode, getTLBCode } from './src/main'
import { getDefaulHumanJsonUnsafe } from './src/tlbutils'

function genCodeForTest(name: string) {
  const fixturesDir = path.resolve(__dirname, 'test')
  generateCode(path.resolve(fixturesDir, 'tlb', name + '.tlb'), 'test/generated_files/generated_' + name + '.ts', 'typescript')
}

// genCodeForTest('block')
// genCodeForTest('test')

async function tmp() {
  let tlbCode = await getTLBCode("test/tlb/test.tlb");
  let block = tlbCode.types.get("Block");
  if (block !== undefined) {
    getDefaulHumanJsonUnsafe(tlbCode, block);
  }
}
