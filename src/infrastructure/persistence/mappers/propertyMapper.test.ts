import {
	createProperty,
	createPropertyPersistenceObject,
} from "../../../utils/property";
import type { PropertyEntity } from "../entities/propertyEntity";
import { propertyToDomain, propertyToPersistence } from "./propertyMapper";

describe("PropertyMapper", () => {
	describe("toPersistence", () => {
		it("should map all property fields to persistence entity", () => {
			const property = createProperty();

			const propertyEntity = propertyToPersistence(property);

			expect(propertyEntity.id).toBe(property.getId());
			expect(propertyEntity.title).toBe(property.getTitle());
			expect(propertyEntity.description).toBe(property.getDescription());
			expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
			expect(propertyEntity.basePrice).toBe(property.getBasePricePerNight());
		});
	});

	describe("toDomain", () => {
		it("should map all property fields to domain entity", () => {
			const propertyEntity = createPropertyPersistenceObject();

			const property = propertyToDomain(propertyEntity);

			expect(property.getId()).toBe(propertyEntity.id);
			expect(property.getTitle()).toBe(propertyEntity.title);
			expect(property.getDescription()).toBe(propertyEntity.description);
			expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
			expect(property.getBasePricePerNight()).toBe(propertyEntity.basePrice);
		});

		it("should throw an error when mapping a property persistence with invalid base price", () => {
			const propertyEntity: PropertyEntity = {
				basePrice: NaN,
				description: "A nice place",
				id: "prop-123",
				maxGuests: 4,
				title: "Cozy Apartment",
				bookings: [],
			};
			expect(() => propertyToDomain(propertyEntity)).toThrow(
				"Invalid base price for property",
			);
		});
	});
});
