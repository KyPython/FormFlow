export default {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg|jpg|jpeg|png|gif)$": "<rootDir>/__mocks__/fileMock.js"
  }
}