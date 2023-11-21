import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse } from '../src'
import { ast } from '../src'
import { generate } from '../src/codegen/main'
import { Program } from '../src/ast/nodes'

import { TwoConstructors, Simple, loadTwoConstructors, loadSimple, storeTwoConstructors, storeSimple, TypedParam, loadTypedParam, storeTypedParam } from '../generated_test'
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

function checkSameOnStoreLoad(expected: any, load: any, store: any) {
    let cell = beginCell();
    store(expected)(cell);
    let actual = load(cell.endCell().beginParse())
    expect(deepEqual(expected, actual)).toBeTruthy()
}

function checkThrowOnStoreLoad(expected: any, load: any, store: any) {
    const t = () => {
        let cell = beginCell();
        store(expected)(cell);
        let actual = load(cell.endCell().beginParse())
        return actual;
    }
    expect(t).toThrow(Error);
}

describe('Generating tlb code', () => {
    test('Basic types', () => {
        expect.hasAssertions()

        let simple: Simple = { kind: 'Simple', a: 827, b: 387 }
        checkSameOnStoreLoad(simple, loadSimple, storeSimple);
        let tcFalse: TwoConstructors = { 'kind': 'TwoConstructors_bool_false', a: 1000, b: 10, c: 1000 }
        checkSameOnStoreLoad(tcFalse, loadTwoConstructors, storeTwoConstructors)
        let tcTooBigNumberB: TwoConstructors = { 'kind': 'TwoConstructors_bool_false', a: 1000, b: 128, c: 1000 }
        checkThrowOnStoreLoad(tcTooBigNumberB, loadTwoConstructors, storeTwoConstructors)
        let tcTrue: TwoConstructors = {'kind': 'TwoConstructors_bool_true', b: 1000}
        checkSameOnStoreLoad(tcTrue, loadTwoConstructors, storeTwoConstructors)
        let typedConstructor: TypedParam = {'kind': 'TypedParam', c: 5, y: {'kind': 'FixedIntParam', y: 10}}
        // checkSameOnStoreLoad(typedConstructor, loadTypedParam, storeTypedParam);
    })
})
