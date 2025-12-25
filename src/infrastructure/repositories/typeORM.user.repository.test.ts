import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../persistence/entities/userEntity";
import { TypeORMUserRepository } from "./typeORM.user.repository";

describe("TypeORMUserRepository", () => {
	let dataSource: DataSource;
	let userRepository: TypeORMUserRepository;
	let repository: Repository<UserEntity>;
	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			entities: [UserEntity],
			synchronize: true,
			logging: false,
			dropSchema: true,
		});
		await dataSource.initialize();
		repository = dataSource.getRepository(UserEntity);
		userRepository = new TypeORMUserRepository(repository);
	});

	afterAll(async () => {
		await dataSource.destroy();
	});
	it("it should save a user successfully", async () => {
		const user = new User("1", "Matheus Borges");

		await userRepository.save(user);

		const savedUser = await repository.findOne({ where: { id: "1" } });

		expect(savedUser).toBeDefined();
		expect(savedUser?.name).toBe("Matheus Borges");
	});

	it("it should retrieve a user by ID successfully", async () => {
		const userEntity = new UserEntity();
		userEntity.id = "2";
		userEntity.name = "Ana Silva";
		await repository.save(userEntity);

		const user = await userRepository.findById("2");

		expect(user).toBeDefined();
		expect(user?.getId()).toBe("2");
		expect(user?.getName()).toBe("Ana Silva");
	});

	it("it should return null when user is not found", async () => {
		const user = await userRepository.findById("non-existent-id");
		expect(user).toBeNull();
	});
});
