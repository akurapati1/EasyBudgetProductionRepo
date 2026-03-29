module.exports = {
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|@testing-library|styled-components)/)"
  ],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: [
    "<rootDir>/src/__tests__/**/*.test.js",
    "<rootDir>/src/__tests__/**/*.spec.js"
  ],
  testRegex: "src/__tests__/.*\\.(test|spec)\\.js$",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js"
  }
};
