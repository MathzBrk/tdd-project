import { Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/userRepository";
import { UserEntity } from "../persistence/entities/userEntity";
import { UserMapper } from "../persistence/mappers/userMapper";

export class TypeORMUserRepository implements UserRepository {
	constructor(private readonly repository: Repository<UserEntity>) {}

	async save(user: User): Promise<void> {
		const userEntity = UserMapper.toPersistence(user);
		await this.repository.save(userEntity);
	}

	async findById(userId: string): Promise<User | null> {
		const userEntity = await this.repository.findOneBy({ id: userId });
		if (!userEntity) {
			return null;
		}
		return UserMapper.toDomain(userEntity);
	}
}
