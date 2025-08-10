module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], // lcov is needed for Jenkins HTML report

  // Fail the test run if coverage falls below these thresholds
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    },
    // Optional: Higher requirement for sentimentService.js
    './src/services/sentimentService.js': {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
};
// This configuration file sets up Jest for testing a Node.js backend.
// It specifies the test environment, file patterns for tests, and coverage settings.
// The coverage thresholds ensure that the code quality remains high, especially for critical files like sentimentService.js.
// The configuration is designed to work seamlessly with CI/CD pipelines, such as Jenkins, to enforce code quality standards.
// Keeps your current test setup
// Adds a global minimum of 80% coverage for everything
// Enforces 90% coverage for sentimentService.js specifically
// Causes Jest (and therefore Jenkins) to fail the build if thresholds aren’t met