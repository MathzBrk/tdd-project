import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/propertyEntity";

export const propertyToPersistence = (domain: Property): PropertyEntity => {
	const entity = new PropertyEntity();
	entity.id = domain.getId();
	entity.title = domain.getTitle();
	entity.description = domain.getDescription();
	entity.maxGuests = domain.getMaxGuests();
	entity.basePrice = domain.getBasePricePerNight();
	return entity;
};

export const propertyToDomain = (entity: PropertyEntity): Property => {
	return new Property(
		entity.id,
		entity.title,
		entity.description,
		entity.maxGuests,
		Number(entity.basePrice),
	);
};
