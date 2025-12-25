import { User } from "../domain/entities/user";
import { UserEntity } from "../infrastructure/persistence/entities/userEntity";

export const createUser = (
	overrides?: Partial<{
		id: string;
		name: string;
	}>,
): User => {
	return new User(
		overrides?.id ?? "test-user-id",
		overrides?.name ?? "Test User",
	);
};

export const createUserPersistenceObject = (
	overrides?: Partial<{
		id: string;
		name: string;
	}>,
): UserEntity => {
	const userEntity = new UserEntity();
	userEntity.id = overrides?.id ?? "test-user-id";
	userEntity.name = overrides?.name ?? "Test User";
	return userEntity;
};
