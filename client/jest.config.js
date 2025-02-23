module.exports = {
  transform: {
      "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
      "/node_modules/(?!(axios|@testing-library)/)" // Allow transformation of @testing-library packages
  ],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: [
      "<rootDir>/src/__tests__/**/*.(test|spec).js"
  ],
};