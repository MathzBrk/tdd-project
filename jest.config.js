module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/*.test.ts"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
