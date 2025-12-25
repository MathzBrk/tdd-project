import { DataSource } from "typeorm";
import { BookingService } from "../../application/services/bookingService";
import { PropertyService } from "../../application/services/propertyService";
import { UserService } from "../../application/services/userService";
import type { BookingRepository } from "../../domain/repositories/bookingRepository";
import type { PropertyRepository } from "../../domain/repositories/propertyRepository";
import type { UserRepository } from "../../domain/repositories/userRepository";
import { BookingEntity } from "../../infrastructure/persistence/entities/bookingEntity";
import { PropertyEntity } from "../../infrastructure/persistence/entities/propertyEntity";
import { UserEntity } from "../../infrastructure/persistence/entities/userEntity";
import { TypeORMBookingRepository } from "../../infrastructure/repositories/typeORM.booking.repository";
import { TypeORMPropertyRepository } from "../../infrastructure/repositories/typeORM.property.repository";
import { TypeORMUserRepository } from "../../infrastructure/repositories/typeORM.user.repository";
import { BookingController } from "../../infrastructure/web/bookingController";
import { PropertyController } from "../../infrastructure/web/propertyController";

/**
 * Container interface that holds all test dependencies.
 * This provides a clean abstraction for E2E tests, encapsulating
 * the entire dependency graph needed for testing.
 */
export interface TestContainer {
	dataSource: DataSource;
	repositories: {
		bookingRepository: BookingRepository;
		propertyRepository: PropertyRepository;
		userRepository: UserRepository;
	};
	services: {
		bookingService: BookingService;
		propertyService: PropertyService;
		userService: UserService;
	};
	controllers: {
		bookingController: BookingController;
		propertyController: PropertyController;
	};
	cleanup(): Promise<void>;
}

/**
 * Factory function that creates and initializes a complete test container.
 *
 * This function handles:
 * 1. Database initialization (in-memory SQLite)
 * 2. Repository instantiation
 * 3. Service layer construction with proper dependency injection
 * 4. Controller initialization
 * 5. Cleanup mechanism for teardown
 *
 * @returns Promise<TestContainer> - Fully initialized container ready for testing
 */
export async function createTestContainer(): Promise<TestContainer> {
	// Step 1: Initialize in-memory database with all entities
	const dataSource = new DataSource({
		type: "sqlite",
		database: ":memory:",
		entities: [BookingEntity, PropertyEntity, UserEntity],
		synchronize: true,
		logging: false,
		dropSchema: true,
	});

	await dataSource.initialize();

	// Step 2: Create repository layer with TypeORM implementations
	const bookingRepository = new TypeORMBookingRepository(
		dataSource.getRepository(BookingEntity),
	);
	const propertyRepository = new TypeORMPropertyRepository(
		dataSource.getRepository(PropertyEntity),
	);
	const userRepository = new TypeORMUserRepository(
		dataSource.getRepository(UserEntity),
	);

	// Step 3: Build service layer with injected repositories
	// Order matters: PropertyService and UserService have no dependencies,
	// but BookingService depends on both
	const propertyService = new PropertyService(propertyRepository);
	const userService = new UserService(userRepository);
	const bookingService = new BookingService(
		bookingRepository,
		propertyService,
		userService,
	);

	// Step 4: Initialize controller layer
	const bookingController = new BookingController(bookingService);
	const propertyController = new PropertyController(propertyService);

	// Step 5: Return container with cleanup mechanism
	return {
		dataSource,
		repositories: {
			bookingRepository,
			propertyRepository,
			userRepository,
		},
		services: {
			bookingService,
			propertyService,
			userService,
		},
		controllers: {
			bookingController,
			propertyController,
		},
		cleanup: async () => {
			await dataSource.destroy();
		},
	};
}
