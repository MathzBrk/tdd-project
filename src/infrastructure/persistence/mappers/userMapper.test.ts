import { createUser, createUserPersistenceObject } from "../../../utils/user";
import { userToDomain, userToPersistence } from "./userMapper";

describe("UserMapper", () => {
	describe("toPersistence", () => {
		it("should map all user fields to persistence entity", () => {
			const user = createUser();

			const userEntity = userToPersistence(user);

			expect(userEntity.id).toBe(user.getId());
			expect(userEntity.name).toBe(user.getName());
		});
	});

	describe("toDomain", () => {
		it("should map all persistence entity fields to user domain", () => {
			const userPersistence = createUserPersistenceObject();

			const user = userToDomain(userPersistence);

			expect(user.getId()).toBe(userPersistence.id);
			expect(user.getName()).toBe(userPersistence.name);
		});

		it("should throw an error if user name is empty", () => {
			const userPersistence = createUserPersistenceObject({ name: "" });

			expect(() => {
				userToDomain(userPersistence);
			}).toThrow("Name is required");
		});

		it("should throw an error if user id is empty", () => {
			const userPersistence = createUserPersistenceObject({ id: "" });

			expect(() => {
				userToDomain(userPersistence);
			}).toThrow("ID is required");
		});
	});
});
