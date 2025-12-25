import { Property } from "../domain/entities/property";
import { PropertyEntity } from "../infrastructure/persistence/entities/propertyEntity";

export const createProperty = (
	overrides?: Partial<{
		id: string;
		title: string;
		description: string;
		maxGuests: number;
		basePrice: number;
	}>,
): Property => {
	return new Property(
		overrides?.id ?? "test-property-id",
		overrides?.title ?? "Test Property",
		overrides?.description ?? "Test Description",
		overrides?.maxGuests ?? 10,
		overrides?.basePrice ?? 100,
	);
};

export const createPropertyPersistenceObject = (
	overrides?: Partial<{
		id: string;
		title: string;
		description: string;
		maxGuests: number;
		basePrice: number;
	}>,
): PropertyEntity => {
	const propertyEntity = new PropertyEntity();
	propertyEntity.id = overrides?.id ?? "test-property-id";
	propertyEntity.title = overrides?.title ?? "Test Property";
	propertyEntity.description = overrides?.description ?? "Test Description";
	propertyEntity.maxGuests = overrides?.maxGuests ?? 10;
	propertyEntity.basePrice = overrides?.basePrice ?? 100;
	return propertyEntity;
};
