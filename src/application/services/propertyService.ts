import type { Property } from "../../domain/entities/property";
import type { PropertyRepository } from "../../domain/repositories/propertyRepository";

export class PropertyService {
	constructor(private propertyRepository: PropertyRepository) {}

	async findPropertyById(propertyId: string): Promise<Property | null> {
		return this.propertyRepository.findById(propertyId);
	}

	async saveProperty(property: Property): Promise<void> {
		return this.propertyRepository.save(property);
	}
}
