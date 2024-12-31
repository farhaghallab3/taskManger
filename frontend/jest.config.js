module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|some-other-module)/',
  ],
  moduleNameMapper: {
    "^react-router-dom$": "<rootDir>/node_modules/react-router-dom",
    '^axios$': 'axios/dist/axios.js',
  },
  testEnvironment: "jsdom",
};
