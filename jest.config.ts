import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    preset: 'ts-jest',
    silent: false,
    coverageThreshold: {
        global: {
            statements: 91.06,
            branches: 82.69,
            functions: 93.25,
            lines: 91.64,
        },
    },
    coveragePathIgnorePatterns: ['test/', 'src/index.ts'],
    coverageReporters: ['json-summary', 'text', 'lcov'],
};

export default config;
