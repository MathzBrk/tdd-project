import { Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/propertyRepository";
import { PropertyEntity } from "../persistence/entities/propertyEntity";
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
