import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/userRepository";

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findUserById(userId: string): Promise<User | null> {
		return this.userRepository.findById(userId);
	}
}
