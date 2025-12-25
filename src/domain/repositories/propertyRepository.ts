import type { Property } from "../entities/property";

export interface PropertyRepository {
	findById(propertyId: string): Promise<Property | null>;
	save(property: Property): Promise<void>;
}
