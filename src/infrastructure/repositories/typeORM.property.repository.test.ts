import { DataSource, type Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { BookingEntity } from "../persistence/entities/bookingEntity";
import { PropertyEntity } from "../persistence/entities/propertyEntity";
import { UserEntity } from "../persistence/entities/userEntity";
import { TypeORMPropertyRepository } from "./typeORM.property.repository";

describe("TypeORMPropertyRepository", () => {
	let dataSource: DataSource;
	let propertyRepository: TypeORMPropertyRepository;
	let repository: Repository<PropertyEntity>;
	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			entities: [PropertyEntity, BookingEntity, UserEntity],
			synchronize: true,
			logging: false,
			dropSchema: true,
		});
		await dataSource.initialize();
		repository = dataSource.getRepository(PropertyEntity);
		propertyRepository = new TypeORMPropertyRepository(repository);
	});

	afterAll(async () => {
		await dataSource.destroy();
	});

	it("it should save a property successfully", async () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A beautiful house with 3 bedrooms",
			6,
			200,
		);

		await propertyRepository.save(property);

		const savedProperty = await repository.findOne({ where: { id: "1" } });

		expect(savedProperty).toBeDefined();
		expect(savedProperty?.title).toBe("Beautiful House");
	});

	it("it should find a property by a valid id", async () => {
		const property = new Property(
			"2",
			"Modern Apartment",
			"A modern apartment in the city center",
			4,
			120,
		);

		await propertyRepository.save(property);

		const foundProperty = await propertyRepository.findById("2");
		expect(foundProperty).toBeDefined();
		expect(foundProperty?.getId()).toBe("2");
		expect(foundProperty?.getTitle()).toBe("Modern Apartment");
	});

	it("it should return null when finding a property by an invalid id", async () => {
		const foundProperty = await propertyRepository.findById("invalid-id");
		expect(foundProperty).toBeNull();
	});
});
