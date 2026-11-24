/** @type {import('jest').Config} */
module.exports = {
  preset: undefined,
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          jsx: 'react',
          target: 'ES2020',
        },
      },
    ],
  },
  testMatch: ['**/*.test.ts'],
};
