import { User } from "./user";

describe("User Entity", () => {
	it("It should create a user with name and ID", () => {
		const user = new User("1", "Matheus Borges");

		expect(user.getId()).toBe("1");
		expect(user.getName()).toBe("Matheus Borges");
	});

	it("It should throw an error when name is empty", () => {
		expect(() => {
			new User("1", "");
		}).toThrow("Name is required");
	});

	it("It should throw an error when id is empty", () => {
		expect(() => {
			new User("", "Matheus Borges");
		}).toThrow("ID is required");
	});
});
