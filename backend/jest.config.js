module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], // lcov is needed for Jenkins HTML report
};
// This configuration file sets up Jest for testing in a Node.js environment.
// It specifies that tests should be found in the __tests__ directory and have a .test.js suffix.
// The verbose option is enabled to provide detailed test results in the output.
// This file is essential for running tests in the backend of the application, ensuring that the test suite is properly configured and can be executed by the CI/CD pipeline.
// It is typically located at the root of the backend directory, such as backend/jest.config.js.
// The configuration ensures that the backend tests can be run independently of the frontend, allowing for a clear separation of concerns in the testing process.