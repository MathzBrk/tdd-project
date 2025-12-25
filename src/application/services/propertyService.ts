import { v4 as uuidv4 } from "uuid";

import type { Property } from "../../domain/entities/property";
import type { PropertyRepository } from "../../domain/repositories/propertyRepository";
import { createProperty } from "../../utils/property";
import type { CreatePropertyDTO } from "../dtos/createProperty.dto";

export class PropertyService {
	constructor(private propertyRepository: PropertyRepository) {}

	async findPropertyById(propertyId: string): Promise<Property | null> {
		return this.propertyRepository.findById(propertyId);
	}

	async saveProperty(dto: CreatePropertyDTO): Promise<Property> {
		// Using factory without isTesting flag - will validate all fields
		const newProperty = createProperty({
			id: uuidv4(),
			title: dto.title,
			description: dto.description,
			basePricePerNight: dto.pricePerNight,
			maxGuests: dto.maxGuests,
		});
		await this.propertyRepository.save(newProperty);
		return newProperty;
	}
}
