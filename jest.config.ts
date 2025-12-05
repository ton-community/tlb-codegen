import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    preset: 'ts-jest',
    silent: false,
    coverageThreshold: {
        global: {
            statements: 88.74,
            branches: 80.53,
            functions: 93.77,
            lines: 89.22,
        },
    },
    coveragePathIgnorePatterns: ['test/', 'src/index.ts'],
    coverageReporters: ['json-summary', 'text', 'lcov'],
};

export default config;
