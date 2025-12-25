import type { Repository } from "typeorm";
import type { Property } from "../../domain/entities/property";
import type { PropertyRepository } from "../../domain/repositories/propertyRepository";
import type { PropertyEntity } from "../persistence/entities/propertyEntity";
import {
	propertyToDomain,
	propertyToPersistence,
} from "../persistence/mappers/propertyMapper";

export class TypeORMPropertyRepository implements PropertyRepository {
	constructor(private readonly repository: Repository<PropertyEntity>) {}

	async save(property: Property): Promise<void> {
		const propertyEntity = propertyToPersistence(property);
		await this.repository.save(propertyEntity);
	}

	async findById(propertyId: string): Promise<Property | null> {
		const propertyEntity = await this.repository.findOne({
			where: { id: propertyId },
		});
		if (!propertyEntity) {
			return null;
		}
		return propertyToDomain(propertyEntity);
	}
}
