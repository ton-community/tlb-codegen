import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse } from '../src'
import { ast } from '../src'
import { generate } from '../src/codegen/main'
import { Program } from '../src/ast/nodes'
import { Slice } from 'ton'

import { TwoConstructors, Simple, loadTwoConstructors, loadSimple, storeTwoConstructors, storeSimple, TypedParam, loadTypedParam, storeTypedParam, TypedField, loadTypedField, storeTypedField, ExprArg, BitLenArg, loadBitLenArg, storeBitLenArg, BitLenArgUser, loadBitLenArgUser, storeBitLenArgUser, ExprArgUser, loadExprArgUser, storeExprArgUser, ComplexTypedField, loadComplexTypedField, storeComplexTypedField, CellTypedField, storeCellTypedField, loadCellTypedField, CellsSimple, loadCellsSimple, storeCellsSimple } from '../generated_test'
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

function checkSameOnStoreLoad(expected: any, load: any, store: any, expectCell?: any) {
    let cell = beginCell();
    store(expected)(cell);
    let slice = cell.endCell().beginParse();
    if (expectCell) {
        expectCell(slice)
    }
    let actual = load(slice)
    expect(deepEqual(expected, actual)).toBeTruthy()
}

function checkDifferOnStoreLoad(expected: any, load: any, store: any) {
    let cell = beginCell();
    store(expected)(cell);
    let actual = load(cell.endCell().beginParse())
    expect(deepEqual(expected, actual)).toBeFalsy()
}

function checkThrowOnStoreLoad(expected: any, load: any, store: any, expectCell?: any) {
    const t = () => {
        let cell = beginCell();
        store(expected)(cell);
        let slice = cell.endCell().beginParse();
        if (expectCell) {
            expectCell(slice)
        }
        let actual = load(slice)
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
        let typedConstructor: TypedField = {'kind': 'TypedField', c: 5, y: {'kind': 'FixedIntParam', y: 10}}
        checkSameOnStoreLoad(typedConstructor, loadTypedField, storeTypedField);
        let typedParamValue: TypedParam = {'kind': 'TypedParam', x: {'kind': 'Maybe_just', value: {'kind': 'SharpConstructor', c: 5, y: {'kind': 'FixedIntParam', y: 6}}}}
        checkSameOnStoreLoad(typedParamValue, loadTypedParam, storeTypedParam);
        let typedParamNothing: TypedParam = {'kind': 'TypedParam', x:{'kind': 'Maybe_nothing'}}
        checkSameOnStoreLoad(typedParamNothing, loadTypedParam, storeTypedParam);
        let bitlenArgUser: BitLenArgUser = {'kind': 'BitLenArgUser', t: {'kind': 'BitLenArg', x: 4, value: 10}}
        checkSameOnStoreLoad(bitlenArgUser, loadBitLenArgUser, storeBitLenArgUser);
        let bitlenArgUserIncorrect: BitLenArgUser = {'kind': 'BitLenArgUser', t: {'kind': 'BitLenArg', x: 3, value: 10}}
        checkThrowOnStoreLoad(bitlenArgUserIncorrect, loadBitLenArgUser, storeBitLenArgUser);
        let exprArgUser: ExprArgUser = {'kind': 'ExprArgUser', t: {'kind': 'ExprArg', x: 4, value: 10}}
        checkSameOnStoreLoad(exprArgUser, loadExprArgUser, storeExprArgUser);
        let exprArgUserIncorrect: ExprArgUser = {'kind': 'ExprArgUser', t: {'kind': 'ExprArg', x: 5, value: 10}}
        checkDifferOnStoreLoad(exprArgUserIncorrect, loadExprArgUser, storeExprArgUser);
        let complexTypedField: ComplexTypedField = {'kind': 'ComplexTypedField', a:{'kind': 'ExprArgUser', t: {'kind': 'ExprArg', x: 4, value: 10}}}
        checkSameOnStoreLoad(complexTypedField, loadComplexTypedField, storeComplexTypedField);
        let cellTypedField: CellTypedField = {'kind': 'CellTypedField', a:{'kind': 'ExprArgUser', t: {'kind': 'ExprArg', x: 4, value: 10}}}
        checkSameOnStoreLoad(cellTypedField, loadCellTypedField, storeCellTypedField);
    })

    test('Slices', () => {
        let cellsSimple: CellsSimple = {'kind': 'CellsSimple', a: 5, b: 3, c: 4, d: 100, e: 4, q: 1, t: 3}
        checkSameOnStoreLoad(cellsSimple, loadCellsSimple, storeCellsSimple, (slice: Slice) => {
            slice = slice.clone()
            slice.loadRef();
            let slice2 = slice.loadRef().beginParse();
            slice2.loadRef();
            let slice22 = slice2.loadRef().beginParse();
            let slice221 = slice22.loadRef();
        });
        checkThrowOnStoreLoad(cellsSimple, loadCellsSimple, storeCellsSimple, (slice: Slice) => {
            slice = slice.clone()
            slice.loadRef();
            let slice2 = slice.loadRef().beginParse();
            slice2.loadRef();
            let slice22 = slice2.loadRef().beginParse();
            let slice221 = slice22.loadRef();
            let slice2211 = slice221.beginParse().loadRef();
        });
        checkThrowOnStoreLoad(cellsSimple, loadCellsSimple, storeCellsSimple, (slice: Slice) => {
            slice.loadRef();
        });
        checkThrowOnStoreLoad(cellsSimple, loadCellsSimple, storeCellsSimple, (slice: Slice) => {
            slice.preloadRef().beginParse().preloadRef();
        });
        checkSameOnStoreLoad(cellsSimple, loadCellsSimple, storeCellsSimple, (slice: Slice) => {
            slice.preloadRef().beginParse();
        });
    })
})
