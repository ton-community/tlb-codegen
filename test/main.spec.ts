import { describe, expect, test } from '@jest/globals';

import { generateCode, getTLBCode } from '../src';

describe('main', () => {
    test('generateCode', () => {
        expect(generateCode('_ x:# = Foo;', 'typescript')).toMatchSnapshot();
    });

    test('getTLBCode', () => {
        expect(getTLBCode('_ x:# = Foo;')).toMatchSnapshot();
    });
});
