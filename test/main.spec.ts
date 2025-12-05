import { generateCode, getTLBCode } from '../src';

describe('main', () => {
    test('generateCode', () => {
        expect(generateCode('_ x:# = Foo;', 'typescript')).toMatchSnapshot();
    });

    test('getTLBCode', () => {
        expect(getTLBCode('_ x:# = Foo;')).toMatchSnapshot();
    });

    test('generateCode for cell as ref', () => {
        expect(generateCode('_ n:(## 3) c:(n * ^Cell) = T;', 'typescript')).toMatchSnapshot();
    });

    test('generateCode with bit selection', () => {
        expect(
            generateCode('_ a:(## 2) b:(a . 1)?uint32 = T1; _ a:(## 2) b:(a . 2)?uint128 = T2;', 'typescript'),
        ).toMatchSnapshot();
    });
});
