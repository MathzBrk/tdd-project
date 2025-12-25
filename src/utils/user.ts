import { User } from "../domain/entities/user";
import { UserEntity } from "../infrastructure/persistence/entities/userEntity";

interface UserFactoryParams {
	id?: string;
	name?: string;
}

interface UserFactoryOptions extends UserFactoryParams {
	/**
	 * If true, provides test defaults for missing fields.
	 * If false, throws validation errors for missing required fields.
	 * @default false
	 */
	isTesting?: boolean;
}

/**
 * Factory for creating User domain entities.
 *
 * @param options - Configuration for user creation
 * @param options.isTesting - If true, uses test defaults for missing fields
 *
 * @example
 * // In production code (requires all fields)
 * const user = createUser({
 *   id: uuidv4(),
 *   name: dto.name,
 * });
 *
 * @example
 * // In tests (provides defaults)
 * const user = createUser({ isTesting: true });
 * const customUser = createUser({
 *   isTesting: true,
 *   name: "Custom User",
 * });
 */
export const createUser = (options: UserFactoryOptions = {}): User => {
	const { isTesting = false, ...params } = options;

	// In testing mode, provide defaults
	if (isTesting) {
		return new User(
			params.id ?? "test-user-id",
			params.name ?? "Test User",
		);
	}

	// In production mode, require all fields
	// User constructor will validate and throw appropriate errors
	return new User(params.id ?? "", params.name ?? "");
};

/**
 * Convenience function for creating test users.
 * Alias for createUser({ isTesting: true, ...overrides })
 *
 * @param overrides - Optional values to override test defaults
 */
export const createUserForTest = (overrides?: UserFactoryParams): User => {
	return createUser({ isTesting: true, ...overrides });
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
