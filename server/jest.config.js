export default {
  testEnvironment: 'node',
  transform: {}, // Disable transforming JS since we use native ES modules
  testMatch: ['**/__tests__/**/*.spec.js', '**/__tests__/**/*.test.js'],
  verbose: true,
};
