import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse } from '../src'
import { ast } from '../src'
import { generate } from '../src/codegen/main'
import { Program } from '../src/ast/nodes'

import { X, loadX, storeX } from '../generated_test'
import { beginCell } from 'ton'

const fixturesDir = path.resolve(__dirname, 'fixtures')

function deepEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
  
    return true;
  }
  
  function isObject(object: any) {
    return object != null && typeof object === 'object';
  }

describe('parsing into intermediate representation using grammar', () => {
  test('test.tlb can be parsed', () => {
    expect.hasAssertions()


    let xExpected: X = { kind: 'X', a: 827, b: 387 }
    let cell = beginCell();
    storeX(xExpected)(cell);
    let xActual: X = loadX(cell.endCell().beginParse())
    expect(deepEqual(xExpected, xActual)).toBeTruthy()
    
  })
})
