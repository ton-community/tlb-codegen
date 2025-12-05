import { describe, expect, test } from '@jest/globals';

import { firstLower, bitLen, isNameReserved, findNotReservedName, crc32 } from '../src/utils';

describe('Utils functions', () => {
    test('firstLower', () => {
        expect(firstLower('Hello')).toBe('hello');
        expect(firstLower('')).toBe('');
    });

    test('bitLen', () => {
        expect(bitLen(16)).toBe(5);
        expect(bitLen(0)).toBe(1);
        expect(bitLen(1024)).toBe(11);
    });

    test('isNameReserved', () => {
        expect(isNameReserved('class')).toBe(true);
    });

    test('findNotReservedName', () => {
        expect(findNotReservedName('slice')).toBe('_slice');
        expect(findNotReservedName('cell')).toBe('_cell');
        expect(findNotReservedName('sliceData')).toBe('sliceData');
        expect(findNotReservedName('cells')).toBe('cells');
        expect(findNotReservedName('cell_data')).toBe('cell_data');
        expect(findNotReservedName('class', '0')).toBe('class0');
    });

    test('crc32', () => {
        const encoder = new TextEncoder();
        expect(crc32(encoder.encode('r = T')).toString(16)).toBe('30332c00');
    });
});
