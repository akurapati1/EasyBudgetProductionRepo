module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|@testing-library|styled-components)/)"
  ],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: [
    "<rootDir>/src/__tests__/**/*.(test|spec).js"
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js"
  }
};
