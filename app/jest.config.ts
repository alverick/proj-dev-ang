/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  // Matches Karma's coverageReporter dir
  coverageDirectory: 'testresults/coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  // Includes common types required for CI/CD and SonarQube
  coverageReporters: ['json', 'lcov', 'text', 'cobertura'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // CRITICAL for Angular projects that import non-TS/JS assets like CSS or images
  moduleNameMapper: {
    // Stubs for assets that aren't Javascript/Typescript
    '^.+\\.(jpg|jpeg|png|gif|webp|svg|css|styl|less|sass|scss)$': 'jest-transform-stub',
    // You might also need this for module path aliases used in your Angular project:
    // '^@app/(.*)$': '<rootDir>/src/app/$1',
  },

  // A preset that is used as a base for Jest's configuration
  preset: 'jest-preset-angular',

  // Use this configuration option to add custom reporters to Jest
  // 'default' for console output
  // 'jest-junit' to generate the report for SonarQube/JUnit
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'testresults/sonar', // Matches Karma's sonarqubeReporter outputFolder
        outputName: 'sonar-report.xml', // Matches Karma's sonarqubeReporter reportName

        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Optional: A path to a custom results processor
  // If `jest-junit` does not satisfy your SonarQube XML format, you can use an alternative tool here.
  // For example:
  // testResultsProcessor: 'jest-sonar-reporter',
};

export default config;
