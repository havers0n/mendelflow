module.exports = {
  // Use custom environment to ensure html is defined
  testEnvironment: '<rootDir>/custom-jsdom-environment.js',
  // Collect coverage and enforce thresholds
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.tsx'
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  setupFiles: ['<rootDir>/src/setupEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@mui/material/Unstable_Grid2$': '<rootDir>/src/__mocks__/Unstable_Grid2.js',
    '^@supabase/supabase-js$': '<rootDir>/src/__mocks__/supabase-js.js'
  },
  // Temporarily disable strict coverage thresholds until tests are added
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
}; 