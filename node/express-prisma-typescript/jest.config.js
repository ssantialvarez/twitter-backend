/** @type {import('ts-jest').JestConfigWithTsJest} **/
const { defaults } = require('jest-config');

module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: "node",
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@utils$': '<rootDir>/src/utils',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@domains$': '<rootDir>/src/domains',
    '^@app$': '<rootDir>/src/app',
    '^@router$': '<rootDir>/src/router'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/domains/**/service/*.impl.ts'
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
};






  