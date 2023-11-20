import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse } from '../src'
import { ast } from '../src'
import { generate } from '../src/codegen/main'
import { Program } from '../src/ast/nodes'

const fixturesDir = path.resolve(__dirname, 'fixtures')


describe('parsing into intermediate representation using grammar', () => {
  test('block.tlb can be parsed', () => { 
    // console.log(util.inspect(babelTestAst.program.body[2], false, null, true /* enable colors */))

    expect.hasAssertions()

    const input = fs.readFileSync(
      path.resolve(fixturesDir, 'tlb', 'my.tlb'),
      'utf-8',
    )
    const parsed = parse(input)

    expect(parsed.shortMessage).toBe(undefined)
    expect(parsed.succeeded()).toBe(true)

    const tree = ast(input)

    fs.writeFile('generated.ts', generate(tree), () => {});


    expect(tree).toBeInstanceOf(Program)
  })
})


/*
  storeY(y)(builder)
*/