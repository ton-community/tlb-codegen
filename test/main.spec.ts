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
});
