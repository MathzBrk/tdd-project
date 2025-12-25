import { User } from "../../domain/entities/user";
import { FakeUserRepository } from "../../infrastructure/repositories/fakeUserRepository";
import { UserService } from "./userService";

describe("User Service", () => {
	let userService: UserService;
	let fakeUserRepository: FakeUserRepository;

	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		userService = new UserService(fakeUserRepository);
	});

	it("it should return null when an invalid user ID is provided", async () => {
		const user = await userService.findUserById("invalid-id");
		expect(user).toBeNull();
	});

	it("it should return an user when a valid user ID is provided", async () => {
		const user = await userService.findUserById("1");
		expect(user).not.toBeNull();
		expect(user?.getId()).toBe("1");
	});

	it("it should save a new user and retrieve it by ID", async () => {
		const newUser = new User("2", "Jane Doe");

		await fakeUserRepository.save(newUser);

		const retrievedUser = await userService.findUserById("2");
		expect(retrievedUser).not.toBeNull();
		expect(retrievedUser?.getId()).toBe("2");
		expect(retrievedUser?.getName()).toBe("Jane Doe");
	});
});
