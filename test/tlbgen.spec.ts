import { Address, BitString, Builder, Cell, Dictionary, ExternalAddress, Slice, Tuple, TupleItemInt, beginCell, parseTuple, serializeTuple } from '@ton/core';
import { describe, expect, test } from '@jest/globals';
import { loadBlock, loadHashmap, storeBlock, storeHashmap } from './generated_files/generated_block';
import { AddressUser, AnonymousData, AnyAddressUser, loadVmStackValue, storeVmStackValue, BitLenArg, BitLenArgUser, BitSelection, BitUser, BoolUser, CellTypedField, CellsSimple, CheckCrc32, CheckKeyword, CombArgCellRefUser, ComplexTypedField, ConditionalField, ConditionalRef, ConstructorOrder, DollarTag, EmptyTag, EqualityExpression, ExprArgUser, ExtAddressUser, FalseAnonField, FixedIntParam, GramsUser, HashmapAugEUser, HashmapEUser, HashmapExprKeyUser, HashmapOneCombUser, HashmapTPCell, HashmapVUIUser, HashmapVarKeyUser, ImplicitCondition, IntBitsOutside, IntBitsParametrizedOutside, LessThan, LoadFromNegationOutsideExpr, ManyComb, MathExprAsCombArg, MultipleEmptyConstructor, NegationFromImplicit, OneComb, ParamConst, ParamDifNames, ParamDifNamesUser, ParamNamedArgInSecondConstr, RefCombinatorAny, RefCombinatorInRef, SharpConstructor, SharpTag, Simple, True, TupleCheck, TwoConstructors, TypedField, TypedParam, Unary, UnaryUserCheckOrder, VMStackUser, VarIntegerUser, VarUIntegerUser, VmStackValue, loadAddressUser, loadAnonymousData, loadAnyAddressUser, loadBitLenArg, loadBitLenArgUser, loadBitSelection, loadBitUser, loadBoolUser, loadCellTypedField, loadCellsSimple, loadCheckCrc32, loadCheckKeyword, loadCombArgCellRefUser, loadComplexTypedField, loadConditionalField, loadConditionalRef, loadConstructorOrder, loadDollarTag, loadEmptyTag, loadEqualityExpression, loadExprArgUser, loadExtAddressUser, loadFalseAnonField, loadGramsUser, loadHashmapAugEUser, loadHashmapEUser, loadHashmapExprKeyUser, loadHashmapOneCombUser, loadHashmapTPCell, loadHashmapVUIUser, loadHashmapVarKeyUser, loadImplicitCondition, loadIntBitsOutside, loadIntBitsParametrizedOutside, loadLessThan, loadLoadFromNegationOutsideExpr, loadManyComb, loadMathExprAsCombArg, loadMultipleEmptyConstructor, loadNegationFromImplicit, loadParamConst, loadParamDifNames, loadParamDifNamesUser, loadParamNamedArgInSecondConstr, loadRefCombinatorAny, loadRefCombinatorInRef, loadSharpConstructor, loadSharpTag, loadSimple, loadTrue, loadTupleCheck, loadTwoConstructors, loadTypedField, loadTypedParam, loadUnary, loadUnaryUserCheckOrder, loadVMStackUser, loadVarIntegerUser, loadVarUIntegerUser, loadVmStack, loadVmStackList, storeAddressUser, storeAnonymousData, storeAnyAddressUser, storeBitLenArg, storeBitLenArgUser, storeBitSelection, storeBitUser, storeBoolUser, storeCellTypedField, storeCellsSimple, storeCheckCrc32, storeCheckKeyword, storeCombArgCellRefUser, storeComplexTypedField, storeConditionalField, storeConditionalRef, storeConstructorOrder, storeDollarTag, storeEmptyTag, storeEqualityExpression, storeExprArgUser, storeExtAddressUser, storeFalseAnonField, storeGramsUser, storeHashmapAugEUser, storeHashmapEUser, storeHashmapExprKeyUser, storeHashmapOneCombUser, storeHashmapTPCell, storeHashmapVUIUser, storeHashmapVarKeyUser, storeImplicitCondition, storeIntBitsOutside, storeIntBitsParametrizedOutside, storeLessThan, storeLoadFromNegationOutsideExpr, storeManyComb, storeMathExprAsCombArg, storeMultipleEmptyConstructor, storeNegationFromImplicit, storeParamConst, storeParamDifNames, storeParamDifNamesUser, storeParamNamedArgInSecondConstr, storeRefCombinatorAny, storeRefCombinatorInRef, storeSharpConstructor, storeSharpTag, storeSimple, storeTrue, storeTupleCheck, storeTwoConstructors, storeTypedField, storeTypedParam, storeUnary, storeUnaryUserCheckOrder, storeVMStackUser, storeVarIntegerUser, storeVarUIntegerUser, storeVmStack, storeVmStackList, CheckCrc32_a, CheckCrc32_b, TagCalculatorExample, storeTagCalculatorExample, loadTagCalculatorExample } from './generated_files/generated_test';
import path from 'path';
import fs from 'fs';
import { generateCodeFromData } from '../src/main';

function isPrimitive(input: object) {
    if (input == null) {
        // This is here to correctly handle document.all.
        return input === null || input === undefined;
    }
    const type = typeof input;
    return type !== "object" && type !== "function";
}

function deepEqual(object1: any, object2: any): boolean {
    if (isPrimitive(object1) && isPrimitive(object2)) {
        return object1 == object2;
    }
    if (object1 instanceof BitString && object2 instanceof BitString) {
        return object1.equals(object2);
    }
    if (object1 instanceof Slice && object2 instanceof Slice) {
        return object1.toString() == object2.toString();
    }
    if (object1 instanceof Cell && object2 instanceof Cell) {
        return deepEqual(object1.beginParse(true), object2.beginParse(true));
    }
    if (object1 instanceof Address && object2 instanceof Address) {
        return object1.equals(object2);
    }

    if (object1 instanceof Dictionary && object2 instanceof Dictionary) {
        if (object1.size != object2.size) {
            return false;
        }
        let ok = true;
        object1.keys().forEach((key) => {
            let value1 = object1.get(key);
            if (!object2.has(key)) {
                ok = false;
            }
            let value2 = object2.get(key);
            let equal = deepEqual(value1, value2);
            if (!equal) {
                ok = false;
            }
        })
        return ok;
    }

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
    let equal = deepEqual(expected, actual);
    expect(equal).toBeTruthy()
}

function checkDifferOnStoreLoad(expected: any, load: any, store: any) {
    let cell = beginCell();
    store(expected)(cell);
    let actual = load(cell.endCell().beginParse())
    expect(deepEqual(expected, actual)).toBeFalsy()
}

function getBitStringOne(bit: boolean): BitString {
    return beginCell().storeBit(bit).endCell().beginParse().loadBits(1);
}

function getBitStringArray(bitString: string) {
    let result: BitString[] = [];
    for (let i = 0; i < bitString.length; i++) {
        result.push(getBitStringOne(bitString[i] == '1'))
    }
    return result;
}

function getBooleanArray(bitString: string) {
    let result: boolean[] = [];
    for (let i = 0; i < bitString.length; i++) {
        result.push(bitString[i] == '1')
    }
    return result;
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

export type TLFunction = {
    decode: any
    encode: any
};

describe('Generating tlb code', () => {
    test('Basic types', () => {
        expect.hasAssertions()

        let simple: Simple = { kind: 'Simple', a: 827, b: 387 }
        checkSameOnStoreLoad(simple, loadSimple, storeSimple);
        let tcFalse: TwoConstructors = { 'kind': 'TwoConstructors_bool_false', a: 1000, b: 10, c: 1000 }
        checkSameOnStoreLoad(tcFalse, loadTwoConstructors, storeTwoConstructors)
        let tcTooBigNumberB: TwoConstructors = { 'kind': 'TwoConstructors_bool_false', a: 1000, b: 128, c: 1000 }
        checkThrowOnStoreLoad(tcTooBigNumberB, loadTwoConstructors, storeTwoConstructors)
        let tcTrue: TwoConstructors = { 'kind': 'TwoConstructors_bool_true', b: 1000 }
        checkSameOnStoreLoad(tcTrue, loadTwoConstructors, storeTwoConstructors)
        let typedConstructor: TypedField = { 'kind': 'TypedField', c: 5, y: { 'kind': 'FixedIntParam', y: 10 } }
        checkSameOnStoreLoad(typedConstructor, loadTypedField, storeTypedField);
        let typedParamValue: TypedParam = { 'kind': 'TypedParam', x: { 'kind': 'Maybe_just', value: { 'kind': 'SharpConstructor', c: 5, y: { 'kind': 'FixedIntParam', y: 6 } } } }
        checkSameOnStoreLoad(typedParamValue, loadTypedParam, storeTypedParam);
        let typedParamNothing: TypedParam = { 'kind': 'TypedParam', x: { 'kind': 'Maybe_nothing' } }
        checkSameOnStoreLoad(typedParamNothing, loadTypedParam, storeTypedParam);
        let bitlenArgUser: BitLenArgUser = { 'kind': 'BitLenArgUser', t: { 'kind': 'BitLenArg', x: 4, value: BigInt(10) } }
        checkSameOnStoreLoad(bitlenArgUser, loadBitLenArgUser, storeBitLenArgUser);
        let bitlenArgUserIncorrect: BitLenArgUser = { 'kind': 'BitLenArgUser', t: { 'kind': 'BitLenArg', x: 3, value: BigInt(10) } }
        checkThrowOnStoreLoad(bitlenArgUserIncorrect, loadBitLenArgUser, storeBitLenArgUser);
        let exprArgUser: ExprArgUser = { 'kind': 'ExprArgUser', t: { 'kind': 'ExprArg', x: 4, value: BigInt(10) } }
        checkSameOnStoreLoad(exprArgUser, loadExprArgUser, storeExprArgUser);
        let exprArgUserIncorrect: ExprArgUser = { 'kind': 'ExprArgUser', t: { 'kind': 'ExprArg', x: 5, value: BigInt(10) } }
        checkDifferOnStoreLoad(exprArgUserIncorrect, loadExprArgUser, storeExprArgUser);
        let complexTypedField: ComplexTypedField = { 'kind': 'ComplexTypedField', a: { 'kind': 'ExprArgUser', t: { 'kind': 'ExprArg', x: 4, value: BigInt(10) } } }
        checkSameOnStoreLoad(complexTypedField, loadComplexTypedField, storeComplexTypedField);
        let cellTypedField: CellTypedField = { 'kind': 'CellTypedField', a: { 'kind': 'ExprArgUser', t: { 'kind': 'ExprArg', x: 4, value: BigInt(10) } } }
        checkSameOnStoreLoad(cellTypedField, loadCellTypedField, storeCellTypedField);
        let lessThan: LessThan = { kind: 'LessThan', x: 3, y: 7 }
        checkSameOnStoreLoad(lessThan, loadLessThan, storeLessThan);
        let lessThanIncorrectX: LessThan = { kind: 'LessThan', x: 4, y: 7 }
        checkThrowOnStoreLoad(lessThanIncorrectX, loadLessThan, storeLessThan);
        let lessThanIncorrectY: LessThan = { kind: 'LessThan', x: 3, y: 8 }
        checkThrowOnStoreLoad(lessThanIncorrectY, loadLessThan, storeLessThan);
        let paramNamedArgInSecondConstr: ParamNamedArgInSecondConstr = { kind: 'ParamNamedArgInSecondConstr_a', n: 3 }
        checkSameOnStoreLoad(paramNamedArgInSecondConstr, (slice: Slice) => { return loadParamNamedArgInSecondConstr(slice, 3) }, storeParamNamedArgInSecondConstr);
        let anonymousData: AnonymousData = { kind: 'AnonymousData', anon0: 1, anon0_0: 3 }
        checkSameOnStoreLoad(anonymousData, loadAnonymousData, storeAnonymousData);
        let falseAnonField: FalseAnonField = { kind: 'FalseAnonField', value: BigInt(3) }
        checkSameOnStoreLoad(falseAnonField, loadFalseAnonField, storeFalseAnonField)
        let checkKeyword: CheckKeyword = { kind: 'CheckKeyword', const0: 3 }
        checkSameOnStoreLoad(checkKeyword, loadCheckKeyword, storeCheckKeyword);

        let checkBigInt: BitLenArg = { kind: 'BitLenArg', x: 100, value: BigInt(2709958555) * BigInt(1e9) + BigInt(228628813) }
        checkSameOnStoreLoad(checkBigInt, (slice: Slice) => { return loadBitLenArg(slice, checkBigInt.x) }, storeBitLenArg)
    })

    test('Primitives', () => {
        expect.hasAssertions()

        let boolUserTrue: BoolUser = { kind: 'BoolUser', a: { 'kind': 'Bool', 'value': true } }
        checkSameOnStoreLoad(boolUserTrue, loadBoolUser, storeBoolUser);
        let boolUserFalse: BoolUser = { kind: 'BoolUser', a: { 'kind': 'Bool', 'value': false } }
        checkSameOnStoreLoad(boolUserFalse, loadBoolUser, storeBoolUser);

        let expectedAddressUser: AddressUser = { kind: 'AddressUser', src: Address.parseFriendly('EQBmzW4wYlFW0tiBgj5sP1CgSlLdYs-VpjPWM7oPYPYWQEdT').address }
        checkSameOnStoreLoad(expectedAddressUser, loadAddressUser, storeAddressUser)

        let bitUser: BitUser = { kind: 'BitUser', b: false }
        checkSameOnStoreLoad(bitUser, loadBitUser, storeBitUser);

        let gramsUser: GramsUser = { kind: 'GramsUser', g: BigInt(100000) }
        checkSameOnStoreLoad(gramsUser, loadGramsUser, storeGramsUser)

        let extAddressUser: ExtAddressUser = { kind: 'ExtAddressUser', src: new ExternalAddress(BigInt(5623048054), 48) }
        checkSameOnStoreLoad(extAddressUser, loadExtAddressUser, storeExtAddressUser)

        let extAddressUserNull: ExtAddressUser = { kind: 'ExtAddressUser', src: null }
        checkSameOnStoreLoad(extAddressUserNull, loadExtAddressUser, storeExtAddressUser)

        let anyAddressUserInt: AnyAddressUser = { kind: 'AnyAddressUser', src: Address.parseFriendly('EQBmzW4wYlFW0tiBgj5sP1CgSlLdYs-VpjPWM7oPYPYWQEdT').address }
        checkSameOnStoreLoad(anyAddressUserInt, loadAnyAddressUser, storeAnyAddressUser)

        let anyAddressUserExt: AnyAddressUser = { kind: 'AnyAddressUser', src: new ExternalAddress(BigInt(5623048054), 48) }
        checkSameOnStoreLoad(anyAddressUserExt, loadAnyAddressUser, storeAnyAddressUser)

        let anyAddressUserNull: AnyAddressUser = { kind: 'AnyAddressUser', src: null }
        checkSameOnStoreLoad(anyAddressUserNull, loadAnyAddressUser, storeAnyAddressUser)

        let varUIntegerUser: VarUIntegerUser = { kind: 'VarUIntegerUser', v: BigInt(5) }
        checkSameOnStoreLoad(varUIntegerUser, loadVarUIntegerUser, storeVarUIntegerUser)

        let varIntegerUser: VarIntegerUser = { kind: 'VarIntegerUser', v: BigInt(-6) }
        checkSameOnStoreLoad(varIntegerUser, loadVarIntegerUser, storeVarIntegerUser)

        let simpleDict: Dictionary<number, number> = Dictionary.empty()
        simpleDict.set(1, 6);
        simpleDict.set(2, 7);
        simpleDict.set(0, 5);
        let hashmapEUser: HashmapEUser = { kind: 'HashmapEUser', x: simpleDict }
        checkSameOnStoreLoad(hashmapEUser, loadHashmapEUser, storeHashmapEUser);

        let vuiDict: Dictionary<bigint, VarUIntegerUser> = Dictionary.empty()
        vuiDict.set(BigInt(6), { kind: 'VarUIntegerUser', v: BigInt(5) })
        vuiDict.set(BigInt(7), { kind: 'VarUIntegerUser', v: BigInt(3) })
        let hashmapVUIUser: HashmapVUIUser = { kind: 'HashmapVUIUser', 'x': vuiDict }
        checkSameOnStoreLoad(hashmapVUIUser, loadHashmapVUIUser, storeHashmapVUIUser);

        let tpcDict: Dictionary<bigint, TypedParam> = Dictionary.empty()
        tpcDict.set(BigInt(5), { kind: 'TypedParam', x: { kind: 'Maybe_just', value: { kind: 'SharpConstructor', c: 3, y: { kind: 'FixedIntParam', y: 4 } } } })
        tpcDict.set(BigInt(3), { kind: 'TypedParam', x: { kind: 'Maybe_just', value: { kind: 'SharpConstructor', c: 9, y: { kind: 'FixedIntParam', y: 8 } } } })
        let hashmapTPCell: HashmapTPCell = { kind: 'HashmapTPCell', x: tpcDict }
        checkSameOnStoreLoad(hashmapTPCell, loadHashmapTPCell, storeHashmapTPCell);

        let vkDict: Dictionary<bigint, number> = Dictionary.empty()
        vkDict.set(BigInt(3), 6)
        vkDict.set(BigInt(7), 9)
        let hashmapVarKeyUser: HashmapVarKeyUser = { kind: 'HashmapVarKeyUser', x: { kind: 'HashmapVarKey', n: 5, x: vkDict } }
        checkSameOnStoreLoad(hashmapVarKeyUser, loadHashmapVarKeyUser, storeHashmapVarKeyUser);

        let hashmapExprKeyUser: HashmapExprKeyUser = { kind: 'HashmapExprKeyUser', x: { kind: 'HashmapExprKey', n: 5, x: vkDict } }
        checkSameOnStoreLoad(hashmapExprKeyUser, loadHashmapExprKeyUser, storeHashmapExprKeyUser);

        let ocuDict: Dictionary<bigint, OneComb<number>> = Dictionary.empty()
        ocuDict.set(BigInt(1), { kind: 'OneComb', t: 3, x: 6 })
        ocuDict.set(BigInt(19), { kind: 'OneComb', t: 5, x: 4 })
        let hashmapOneCombUser: HashmapOneCombUser = { kind: 'HashmapOneCombUser', x: { kind: 'HashmapOneComb', x: ocuDict } }
        checkSameOnStoreLoad(hashmapOneCombUser, loadHashmapOneCombUser, storeHashmapOneCombUser);

        let dictAug: Dictionary<number, { value: bigint, extra: FixedIntParam }> = Dictionary.empty()
        dictAug.set(5, { value: BigInt(4), extra: { kind: 'FixedIntParam', y: 7 } })
        dictAug.set(6, { value: BigInt(3), extra: { kind: 'FixedIntParam', y: 9 } })
        dictAug.set(5, { value: BigInt(8), extra: { kind: 'FixedIntParam', y: 11 } })
        let hashmapAugEUser: HashmapAugEUser = { kind: 'HashmapAugEUser', x: dictAug }
        checkSameOnStoreLoad(hashmapAugEUser, loadHashmapAugEUser, storeHashmapAugEUser)
    })

    test('Combinators', () => {
        expect.hasAssertions()
        let manyComb: ManyComb = { kind: 'ManyComb', y: { kind: 'OneComb', t: 5, x: { kind: 'OneComb', t: 6, x: { kind: 'OneComb', t: 7, x: 3 } } } };
        checkSameOnStoreLoad(manyComb, loadManyComb, storeManyComb);
        let manyCombIncorrect: ManyComb = { kind: 'ManyComb', y: { kind: 'OneComb', t: 5, x: { kind: 'OneComb', t: 8, x: { kind: 'OneComb', t: 7, x: 8 } } } };
        checkThrowOnStoreLoad(manyCombIncorrect, loadManyComb, storeManyComb);
        let combArgCellRefUser: CombArgCellRefUser = { kind: 'CombArgCellRefUser', x: { kind: 'CombArgCellRef', body: { 'kind': 'Either_right', value: 3 }, info: 4, other: { kind: 'Either_right', value: { kind: 'OneComb', t: 5, x: 5 } }, init: { kind: 'Maybe_just', value: { kind: 'Either_right', value: 4 } } } }
        checkSameOnStoreLoad(combArgCellRefUser, loadCombArgCellRefUser, storeCombArgCellRefUser);
        let mathExprAsCombArg: MathExprAsCombArg = { kind: 'MathExprAsCombArg', n: 8, ref: { kind: 'BitLenArg', x: 10, value: BigInt(1000) } }
        checkSameOnStoreLoad(mathExprAsCombArg, (slice: Slice) => { return loadMathExprAsCombArg(slice, mathExprAsCombArg.n + 2) }, storeMathExprAsCombArg);

        let refCombinatorAny: RefCombinatorAny = {
            kind: 'RefCombinatorAny',
            msg: { kind: 'Maybe_just', value: beginCell().storeUint(676, 10).endCell() }
        }
        checkSameOnStoreLoad(refCombinatorAny, loadRefCombinatorAny, storeRefCombinatorAny);

        let msgEnvelope: RefCombinatorInRef = { kind: 'RefCombinatorInRef', msg: { kind: 'RefCombinatorInRefHelper', t: 3, y: { kind: 'Maybe_just', value: beginCell().storeUint(3, 32).endCell() } } }
        checkSameOnStoreLoad(msgEnvelope, loadRefCombinatorInRef, storeRefCombinatorInRef);
    });

    test('Naming', () => {
        expect.hasAssertions()

        let multipleEmptyConstructor: MultipleEmptyConstructor = { kind: 'MultipleEmptyConstructor__', a: 5 }
        checkSameOnStoreLoad(multipleEmptyConstructor, (slice: Slice) => { return loadMultipleEmptyConstructor(slice, 0); }, storeMultipleEmptyConstructor);
        let multipleEmptyConstructor1: MultipleEmptyConstructor = { kind: 'MultipleEmptyConstructor__1', b: 6 }
        checkSameOnStoreLoad(multipleEmptyConstructor1, (slice: Slice) => { return loadMultipleEmptyConstructor(slice, 1); }, storeMultipleEmptyConstructor);
        let multipleEmptyConstructor2: MultipleEmptyConstructor = { kind: 'MultipleEmptyConstructor_a', x: 5 }
        checkSameOnStoreLoad(multipleEmptyConstructor2, (slice: Slice) => { return loadMultipleEmptyConstructor(slice, 2); }, storeMultipleEmptyConstructor);

        let trueCheck: True = { kind: 'True' }
        checkSameOnStoreLoad(trueCheck, loadTrue, storeTrue);
    })

    test('Complex Expressions', () => {
        expect.hasAssertions()

        let tupleCheck: TupleCheck = { kind: 'TupleCheck', s: [5, 6, 7] }
        checkSameOnStoreLoad(tupleCheck, loadTupleCheck, storeTupleCheck);

        let conditionalField: ConditionalField = { kind: 'ConditionalField', a: 1, b: 5 }
        checkSameOnStoreLoad(conditionalField, loadConditionalField, storeConditionalField);

        let conditionalFieldIncorrect: ConditionalField = { kind: 'ConditionalField', a: 0, b: 5 }
        checkDifferOnStoreLoad(conditionalFieldIncorrect, loadConditionalField, storeConditionalField);

        let conditionalFieldBUndef: ConditionalField = { kind: 'ConditionalField', a: 0, b: undefined }
        checkSameOnStoreLoad(conditionalFieldBUndef, loadConditionalField, storeConditionalField);

        let bitSelection: BitSelection = { kind: 'BitSelection', a: 5, b: 5 }
        checkSameOnStoreLoad(bitSelection, loadBitSelection, storeBitSelection);

        let bitSelectionIncorrect: BitSelection = { kind: 'BitSelection', a: 8, b: 5 }
        checkDifferOnStoreLoad(bitSelectionIncorrect, loadBitSelection, storeBitSelection);

        let conditionalRef: ConditionalRef = { kind: 'ConditionalRef', x: 1, y: { kind: 'Simple', a: 3, b: 4 } }
        checkSameOnStoreLoad(conditionalRef, loadConditionalRef, storeConditionalRef);

        let conditionalRefUndefined: ConditionalRef = { kind: 'ConditionalRef', x: 0, y: undefined }
        checkSameOnStoreLoad(conditionalRefUndefined, loadConditionalRef, storeConditionalRef);
    })

    test('Exceptions', () => {
        expect.hasAssertions()

        let implicitConditionIncorrect: ImplicitCondition = { kind: 'ImplicitCondition', flags: 200 }
        checkThrowOnStoreLoad(implicitConditionIncorrect, loadImplicitCondition, storeImplicitCondition);

        let implicitCondition: ImplicitCondition = { kind: 'ImplicitCondition', flags: 100 }
        checkSameOnStoreLoad(implicitCondition, loadImplicitCondition, storeImplicitCondition);

        let implicitConditionIncorrectCell = beginCell().storeUint(200, 10).endCell().beginParse();
        expect(() => {
            loadImplicitCondition(implicitConditionIncorrectCell)
        }).toThrow(Error);

        let implicitConditionCell = beginCell().storeUint(100, 10).endCell().beginParse();
        expect(loadImplicitCondition(implicitConditionCell).flags == 100).toBeTruthy()

        let equalityExpression: EqualityExpression = { kind: 'EqualityExpression', n: 2 }
        checkSameOnStoreLoad(equalityExpression, loadEqualityExpression, storeEqualityExpression);

        let equalityExpressionIncorrect: EqualityExpression = { kind: 'EqualityExpression', n: 3 }
        checkThrowOnStoreLoad(equalityExpressionIncorrect, loadEqualityExpression, storeEqualityExpression);
    })

    test('Constructor Tags', () => {
        expect.hasAssertions()

        let sharpConstructor: SharpConstructor = { kind: 'SharpConstructor', c: 5, y: { 'kind': 'FixedIntParam', y: 6 } }
        checkSameOnStoreLoad(sharpConstructor, loadSharpConstructor, storeSharpConstructor);

        let emptyTag: EmptyTag = { kind: 'EmptyTag', a: 3 }
        checkSameOnStoreLoad(emptyTag, loadEmptyTag, storeEmptyTag);
        let emptyTagCell = beginCell();
        storeEmptyTag(emptyTag)(emptyTagCell);
        expect(emptyTagCell.endCell().beginParse().remainingBits == 32).toBeTruthy();

        let sharpTag: SharpTag = { kind: 'SharpTag', x: 3 }
        checkSameOnStoreLoad(sharpTag, loadSharpTag, storeSharpTag);
        let sharpTagCell = beginCell();
        storeSharpTag(sharpTag)(sharpTagCell);
        let sharpTagSlice = sharpTagCell.endCell().beginParse()
        expect(sharpTagSlice.loadUint(8) == 0xf4).toBeTruthy();
        expect(sharpTagSlice.remainingBits == 32).toBeTruthy();

        let dollarTag: DollarTag = { kind: 'DollarTag', x: 3 }
        checkSameOnStoreLoad(dollarTag, loadDollarTag, storeDollarTag);
        let dollarTagCell = beginCell();
        storeDollarTag(dollarTag)(dollarTagCell);
        let dollarTagSlice = dollarTagCell.endCell().beginParse()
        expect(dollarTagSlice.loadUint(4) == 0b1011).toBeTruthy();
        expect(dollarTagSlice.remainingBits == 32).toBeTruthy();

        let constructorOrder: ConstructorOrder = { kind: 'ConstructorOrder_a', a: { kind: 'Simple', a: 2, b: 3 } }
        checkSameOnStoreLoad(constructorOrder, loadConstructorOrder, storeConstructorOrder);

        let checkCrc32A: CheckCrc32 = { kind: 'CheckCrc32_a', a: 3 }
        checkSameOnStoreLoad(checkCrc32A, loadCheckCrc32, storeCheckCrc32);

        let checkCrc32B: CheckCrc32 = { kind: 'CheckCrc32_b', b: 4, c: 5 }
        checkSameOnStoreLoad(checkCrc32B, loadCheckCrc32, storeCheckCrc32);

        let checkCrc32AOpCode = beginCell().storeUint(0x9d97e7a, 32).storeUint(76, 32).endCell().beginParse();
        loadCheckCrc32(checkCrc32AOpCode);
    })

    test('Advanced types', () => {
        expect.hasAssertions()

        let unary: Unary = { kind: 'Unary_unary_succ', n: 2, x: { kind: 'Unary_unary_succ', n: 1, x: { kind: 'Unary_unary_succ', n: 0, x: { kind: 'Unary_unary_zero' } } } }
        checkSameOnStoreLoad(unary, loadUnary, storeUnary);
        let unaryIncorrectOne: Unary = { kind: 'Unary_unary_succ', n: 3, x: { kind: 'Unary_unary_succ', n: 1, x: { kind: 'Unary_unary_succ', n: 0, x: { kind: 'Unary_unary_zero' } } } }
        checkDifferOnStoreLoad(unaryIncorrectOne, loadUnary, storeUnary);
        let unaryIncorrectAll: Unary = { kind: 'Unary_unary_succ', n: 3, x: { kind: 'Unary_unary_succ', n: 2, x: { kind: 'Unary_unary_succ', n: 1, x: { kind: 'Unary_unary_zero' } } } }
        checkDifferOnStoreLoad(unaryIncorrectAll, loadUnary, storeUnary);
        let unaryIncorrectSuccZero: Unary = { kind: 'Unary_unary_succ', n: 3, x: { kind: 'Unary_unary_zero' } }
        checkDifferOnStoreLoad(unaryIncorrectSuccZero, loadUnary, storeUnary);

        let paramConstD: ParamConst = { kind: 'ParamConst_d', n: 1, k: 2, l: 3, m: 4 }
        checkDifferOnStoreLoad(paramConstD, (slice: Slice) => loadParamConst(slice, 1, 1), storeParamConst);
        checkThrowOnStoreLoad(paramConstD, (slice: Slice) => loadParamConst(slice, 1, 2), storeParamConst)
        checkSameOnStoreLoad(paramConstD, (slice: Slice) => loadParamConst(slice, 4, 2), storeParamConst)
        let paramConstB: ParamConst = { kind: 'ParamConst_b', k: 2, m: 4 }
        checkSameOnStoreLoad(paramConstB, (slice: Slice) => loadParamConst(slice, 2, 1), storeParamConst);
        let paramConstC: ParamConst = { kind: 'ParamConst_c', k: 2, m: 4, n: 3 }
        checkSameOnStoreLoad(paramConstC, (slice: Slice) => loadParamConst(slice, 3, 3), storeParamConst);

        let paramDifNamesC: ParamDifNames = { kind: 'ParamDifNames_c', n: 3, x: { kind: 'ParamDifNames_c', n: 2, x: { kind: 'ParamDifNames_c', n: 1, x: { kind: 'ParamDifNames_a' } } } }
        checkSameOnStoreLoad(paramDifNamesC, (slice: Slice) => loadParamDifNames(slice, 2), storeParamDifNames);
        let paramDifNamesD: ParamDifNames = { kind: 'ParamDifNames_d', m: 4, x: { kind: 'ParamDifNames_d', m: 2, x: { kind: 'ParamDifNames_d', m: 1, x: { kind: 'ParamDifNames_b' } } } }
        checkSameOnStoreLoad(paramDifNamesD, (slice: Slice) => loadParamDifNames(slice, 3), storeParamDifNames);

        let paramDifNamesUser: ParamDifNamesUser = { kind: 'ParamDifNamesUser', k: 4, x: { kind: 'ParamDifNames_c', n: 3, x: { kind: 'ParamDifNames_c', n: 2, x: { kind: 'ParamDifNames_c', n: 1, x: { kind: 'ParamDifNames_a' } } } } }
        checkSameOnStoreLoad(paramDifNamesUser, loadParamDifNamesUser, storeParamDifNamesUser);
        let paramDifNamesUserIncorrect: ParamDifNamesUser = { kind: 'ParamDifNamesUser', k: 5, x: { kind: 'ParamDifNames_c', n: 3, x: { kind: 'ParamDifNames_c', n: 2, x: { kind: 'ParamDifNames_c', n: 1, x: { kind: 'ParamDifNames_a' } } } } }
        checkDifferOnStoreLoad(paramDifNamesUserIncorrect, loadParamDifNamesUser, storeParamDifNamesUser);

        let negationFromImplicit: NegationFromImplicit = { kind: 'NegationFromImplicit', t: 4, y: 2, z: 7 }
        checkSameOnStoreLoad(negationFromImplicit, loadNegationFromImplicit, storeNegationFromImplicit)
        let negationFromImplicitIncorrect: NegationFromImplicit = { kind: 'NegationFromImplicit', t: 4, y: 3, z: 7 }
        checkDifferOnStoreLoad(negationFromImplicitIncorrect, loadNegationFromImplicit, storeNegationFromImplicit)

        let unaryUserCheckOrder: UnaryUserCheckOrder = { kind: 'UnaryUserCheckOrder', l: 2, m: 5, label: { kind: 'Unary_unary_succ', n: 1, x: { kind: 'Unary_unary_succ', n: 0, x: { kind: 'Unary_unary_zero' } } } }
        checkSameOnStoreLoad(unaryUserCheckOrder, loadUnaryUserCheckOrder, storeUnaryUserCheckOrder)

        let loadFromNegationOutsideExpr: LoadFromNegationOutsideExpr = { kind: 'LoadFromNegationOutsideExpr', prev_seq_no: 3, seq_no: 4 }
        checkSameOnStoreLoad(loadFromNegationOutsideExpr, loadLoadFromNegationOutsideExpr, storeLoadFromNegationOutsideExpr)

        let tupleVMStack: VMStackUser = { kind: 'VMStackUser', t: [{ 'type': 'int', value: BigInt(1) }, { 'type': 'int', value: BigInt(2) }, { 'type': 'int', value: BigInt(3) }] }
        checkSameOnStoreLoad(tupleVMStack, loadVMStackUser, storeVMStackUser);
    })

    test('Slices', () => {
        expect.hasAssertions()

        let cellsSimple: CellsSimple = { 'kind': 'CellsSimple', a: 5, b: 3, c: 4, d: 100, e: 4, q: 1, t: 3 }
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

        let intBitsOutside: IntBitsOutside = {
            'kind': 'IntBitsOutside',
            x: {
                'kind': 'IntBitsInside',
                a: {
                    'kind': 'IntBits', arg: BigInt(3), d: 5,
                    g: beginCell().storeUint(3, 2).endCell().beginParse().loadBits(2),
                    x: beginCell().storeUint(76, 10).endCell()
                },
                x: 3
            }
        }
        checkSameOnStoreLoad(intBitsOutside, loadIntBitsOutside, storeIntBitsOutside);

        let intBitsParametrizedOutside: IntBitsParametrizedOutside = {
            kind: 'IntBitsParametrizedOutside',
            x: {
                kind: 'IntBitsParametrizedInside',
                a: {
                    kind: 'IntBitsParametrized', e: 5, f: BigInt(3), h: BigInt(7), j: 9, k: BigInt(10),
                    i: beginCell().storeUint(676, 10).endCell().beginParse().loadBits(10),
                    tc: beginCell().storeUint(76, 10).endCell()
                },
                x: 5
            }
        }
        checkSameOnStoreLoad(intBitsParametrizedOutside, loadIntBitsParametrizedOutside, storeIntBitsParametrizedOutside);

        let intBitsParametrizedOutsideIncorrect: IntBitsParametrizedOutside = {
            kind: 'IntBitsParametrizedOutside',
            x: {
                kind: 'IntBitsParametrizedInside',
                a: {
                    kind: 'IntBitsParametrized', e: 6, f: BigInt(3), h: BigInt(7), j: 9, k: BigInt(10),
                    i: beginCell().storeUint(676, 10).endCell().beginParse().loadBits(10),
                    tc: beginCell().storeUint(76, 10).endCell()
                },
                x: 5
            }
        }
        checkDifferOnStoreLoad(intBitsParametrizedOutsideIncorrect, loadIntBitsParametrizedOutside, storeIntBitsParametrizedOutside);
    })

    test('block tlb tests', () => {
        const state = 'te6cckEBCAEA/wAEEBHvVaoAAAABBgQDAQOJSjP2/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAgICAAFAAAACCbjkjfsEBQUABQAACAGGm8ephwAAAAEAAAAAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnREbH';
        const cs = Cell.fromBase64(state);
        let blk = loadBlock(cs.beginParse());
        checkSameOnStoreLoad(blk, loadBlock, storeBlock)

        const state2 = 'te6cckECEQEAAt0AJBAR71Wq////EQECAwQCoJvHqYcAAAAAgAECfjyTAAAAAQAAAAAAAAAAAAAAAABlyLWCAAAogZ67zMAAACiBnrvM0GBwTmIACCBSAiVwRAIlWR/EAAAABQAAAAAAAAAuBQYCEbjkjftFjQskhAcIKooETrjlNgwuHXtEbLkDiuPrh7ZsS5HcxL7sNQNLOzzxOJ8XpFaKmfMqRiqpTnODMFdkpeK+t1j9zpUGcLCGnyCbQQIcAhwJCiOJSjP2/QsLOJrSCYuSECQN4EQ1pAkI/Vq884HrhAXxgd/DMXKL3mNyX4QAmdB48ZNajadP6O+MetbFj9DF2crDtBqc+RNACwwNAJgAACiBnqyKhAIlcESQSl3z7iZHMb+ZzHB8UIicVmATlmlWML4cDjyK41AJDYwykU65Oj8VFycT567wJMI2c1Fp8XEpQ0oBBl7EszbpAJgAACiBnqyKigJ+PJIwkmdyOJaxAUgUAn96h7ctdbYa5ZqyLAxMr2CCCwI53+D63OzKxdebePB4BjmKCG0WpYdB4mhfQTshVEFholJiAiWCyjMIQaAjO2wWUZhB/mYlt0AIDg4ADQAQ7msoAAhojAEDTrjlNgwuHXtEbLkDiuPrh7ZsS5HcxL7sNQNLOzzxOJ8eUBr0CDsnKj+rfShCIEjNWz4L02mNMNBkMZ/Gt7d08wIcAB9ojAEDF6RWipnzKkYqqU5zgzBXZKXivrdY/c6VBnCwhp8gm0F20Jc6TiScBHS6NjRcwVkdaQJ0Gui4rsOnO0bOcbXHBAIcAB8oSAEBDImrgKWVyalum/bej1OHSpOS2UkgmMuIkBF7MzHXi7MAGChIAQEVd40DOrZ4FN5JCQjeUCvgm+Lo7v7TK7JOTt/GFqoW0AAZKEgBARILJG1IfD7ez2RrP8gh/dsLILjLke5aI27M3MaDIy1bABgCASAPEAATvgAAA7yRYnrqkAATv////7yLlvycUBOzqtE=';
        const cs2 = Cell.fromBase64(state2);
        let blk2 = loadBlock(cs2.beginParse());
        checkSameOnStoreLoad(blk2, loadBlock, storeBlock)
    })

    test('Trailing underscore tags', () => {
        expect.hasAssertions()

        let vmStackValue: VmStackValue = { kind: 'VmStackValue_vm_stk_int', value: BigInt(12345) }
        checkSameOnStoreLoad(vmStackValue, loadVmStackValue, storeVmStackValue);

        let vmStackValueCell = beginCell();
        storeVmStackValue(vmStackValue)(vmStackValueCell);
        let vmStackValueSlice = vmStackValueCell.endCell().beginParse();

        expect(vmStackValueSlice.preloadUint(15)).toBe(0x0100);

        vmStackValueSlice.loadUint(15);
        const loadedValue = vmStackValueSlice.loadIntBig(257);
        expect(loadedValue).toBe(BigInt(12345));
    })

    test('Correct tag calculation', () => {
        const checkA: CheckCrc32 = { kind: 'CheckCrc32_a', a: 42 };
        const checkB: CheckCrc32 = { kind: 'CheckCrc32_b', b: 123, c: 456 };

        const cellA = beginCell();
        storeCheckCrc32(checkA)(cellA);
        const finalCellA = cellA.endCell();

        const cellB = beginCell();
        storeCheckCrc32(checkB)(cellB);
        const finalCellB = cellB.endCell();

        const deserializedA = loadCheckCrc32(finalCellA.beginParse());
        const deserializedB = loadCheckCrc32(finalCellB.beginParse());

        expect(deserializedA.kind).toBe(checkA.kind);
        expect((deserializedA as CheckCrc32_a).a).toBe(checkA.a);

        expect(deserializedB.kind).toBe(checkB.kind);
        expect((deserializedB as CheckCrc32_b).b).toBe(checkB.b);
        expect((deserializedB as CheckCrc32_b).c).toBe(checkB.c);


        const sliceA = finalCellA.beginParse();
        const sliceB = finalCellB.beginParse();

        expect(sliceA.loadUint(32)).toBe(0x9d97e7a);
        expect(sliceB.loadUint(32)).toBe(0xa842b3f0);
    });

    test('Correct tag calculation complex', () => {
        const seqNo = 1999;
        const seqNo2 = 2000;

        const tagCalculatorExample: TagCalculatorExample = {
            kind: 'TagCalculatorExample',
            seq_no: 1999,
            seq_no_2: 2000
        };

        const cell = beginCell();
        storeTagCalculatorExample(tagCalculatorExample)(cell);
        const finalCell = cell.endCell();

        const deserializedCell = loadTagCalculatorExample(finalCell.beginParse());

        expect(deserializedCell.kind).toBe(tagCalculatorExample.kind);
        expect((deserializedCell as TagCalculatorExample).prev_seq_no).toBe(((2 + (seqNo + 2)) - 2) - 1);
        expect((deserializedCell as TagCalculatorExample).prev_seq_no_2).toBe(100 + ((seqNo2 * 8) * 7));
        expect((deserializedCell as TagCalculatorExample).seq_no).toBe(tagCalculatorExample.seq_no);
        expect((deserializedCell as TagCalculatorExample).seq_no_2).toBe(tagCalculatorExample.seq_no_2);

        const slice = finalCell.beginParse();

        expect(slice.loadUint(32)).toBe(0xa63f2977);
    });

    test('should generate correct loadVmStack function', async () => {
        const tlbPath = path.resolve(__dirname, 'tlb/vmstack.tlb');
        const tlbSource = fs.readFileSync(tlbPath, 'utf-8');
        const generated = await generateCodeFromData(tlbSource, 'typescript');
        expect(generated).toMatch(/export function loadVmStack\(slice: Slice\): TupleItem\[\] \{/);
        expect(generated).toMatch(/return parseTuple\(slice\.asCell\(\)\)/);
    });
})
