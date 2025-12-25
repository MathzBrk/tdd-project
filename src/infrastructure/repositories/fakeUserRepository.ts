import { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/userRepository";

export class FakeUserRepository implements UserRepository {
	constructor(private users: User[] = []) {
		const user = new User("1", "John Doe");
		this.users.push(user);
	}

	async findById(userId: string): Promise<User | null> {
		return this.users.find((user) => user.getId() === userId) || null;
	}

	async save(user: User): Promise<void> {
		this.users.push(user);
	}
}
