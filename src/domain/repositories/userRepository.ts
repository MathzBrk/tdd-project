import type { User } from "../entities/user";

export interface UserRepository {
	findById(userId: string): Promise<User | null>;
	save(user: User): Promise<void>;
}
