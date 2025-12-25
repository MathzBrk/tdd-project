import { Property } from "../../domain/entities/property";
import { FakePropertyRepository } from "../../infrastructure/repositories/fakePropertyRepository";
import { PropertyService } from "./propertyService";

describe("Property Service", () => {
	let propertyService: PropertyService;
	let fakePropertyRepository: FakePropertyRepository;

	beforeEach(() => {
		fakePropertyRepository = new FakePropertyRepository();
		propertyService = new PropertyService(fakePropertyRepository);
	});

	it("it should return null when an invalid property ID is provided", async () => {
		const property = await propertyService.findPropertyById("invalid-id");
		expect(property).toBeNull();
	});

	it("it should return a property when a valid property ID is provided", async () => {
		const property = await propertyService.findPropertyById("1");
		expect(property).not.toBeNull();
		expect(property?.getId()).toBe("1");
	});

	it("it should save a new property and retrieve it by ID", async () => {
		const property = new Property(
			"2",
			"Cozy Apartment",
			"A cozy apartment near the park",
			4,
			200,
		);

		await fakePropertyRepository.save(property);

		const retrievedProperty = await propertyService.findPropertyById("2");
		expect(retrievedProperty).not.toBeNull();
		expect(retrievedProperty?.getId()).toBe("2");
		expect(retrievedProperty?.getTitle()).toBe("Cozy Apartment");
	});
});
