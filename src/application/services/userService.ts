import { v4 as uuidv4 } from "uuid";

import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/userRepository";
import { createUser } from "../../utils/user";
import { CreateUserDTO } from "../dtos/createUser.dto";

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findUserById(userId: string): Promise<User | null> {
		return this.userRepository.findById(userId);
	}

	async saveUser(dto: CreateUserDTO): Promise<User> {
		const user = createUser({
			id: uuidv4(),
			name: dto.name,
		});
		await this.userRepository.save(user);
		return user;
	}
}
