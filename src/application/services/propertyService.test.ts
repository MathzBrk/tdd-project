import { FakePropertyRepository } from "../../infrastructure/repositories/fakePropertyRepository";
import type { CreatePropertyDTO } from "../dtos/createProperty.dto";
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
		const propertyDTO: CreatePropertyDTO = {
			title: "Cozy Apartment",
			description: "A cozy apartment near the park",
			pricePerNight: 200,
			maxGuests: 4,
		};

		const newProperty = await propertyService.saveProperty(propertyDTO);

		const retrievedProperty = await propertyService.findPropertyById(
			newProperty.getId(),
		);
		expect(retrievedProperty).not.toBeNull();
		expect(retrievedProperty?.getId()).toBe(newProperty.getId());
		expect(retrievedProperty?.getTitle()).toBe("Cozy Apartment");
	});
});
