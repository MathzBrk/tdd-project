module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/*.test.ts"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	// CRITICAL: Run E2E tests sequentially to avoid SQLite database conflicts
	// Each E2E test creates its own in-memory database
	maxWorkers: 1,
	testTimeout: 30000,
};
