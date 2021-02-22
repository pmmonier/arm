module.exports = {
  roots: ["<rootDir>"],
  testPathIgnorePatterns: [
    '/dist/', '/src/'
  ],
  testRegex: '(__test__/.*|(\\.|/)(test|spec))\\.ts$',
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
};
