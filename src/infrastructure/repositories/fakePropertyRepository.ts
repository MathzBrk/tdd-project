import { Property } from "../../domain/entities/property";
import type { PropertyRepository } from "../../domain/repositories/propertyRepository";

export class FakePropertyRepository implements PropertyRepository {
	constructor(private properties: Property[] = []) {
		const property = new Property(
			"1",
			"Beautiful House",
			"A beautiful house in the city center",
			6,
			400,
		);
		this.properties.push(property);
	}

	async findById(propertyId: string): Promise<Property | null> {
		const property = this.properties.find((p) => p.getId() === propertyId);
		return property || null;
	}

	async save(property: Property): Promise<void> {
		this.properties.push(property);
	}
}
