import type { DataSource, Repository } from "typeorm";
import { BookingEntity } from "../../infrastructure/persistence/entities/bookingEntity";
import { PropertyEntity } from "../../infrastructure/persistence/entities/propertyEntity";
import { UserEntity } from "../../infrastructure/persistence/entities/userEntity";

/**
 * Test data structure for basic seed (property + user).
 * This represents the minimal data needed for most booking tests.
 */
export interface TestData {
	property: PropertyEntity;
	user: UserEntity;
}

/**
 * Extended test data structure that includes a booking.
 * Used for tests that require an existing booking (e.g., cancellation flows).
 */
export interface BookingTestData extends TestData {
	booking: BookingEntity;
}

/**
 * Seeds the database with basic test data: one property and one user.
 *
 * This function:
 * 1. Clears all existing data (in reverse dependency order)
 * 2. Creates a standard property with predictable attributes
 * 3. Creates a standard user
 *
 * Use this for tests that need to create bookings from scratch.
 *
 * @param dataSource - TypeORM DataSource instance
 * @returns Promise<TestData> - The seeded property and user entities
 */
export async function seedTestData(dataSource: DataSource): Promise<TestData> {
	const propertyRepo: Repository<PropertyEntity> =
		dataSource.getRepository(PropertyEntity);
	const userRepo: Repository<UserEntity> = dataSource.getRepository(UserEntity);
	const bookingRepo: Repository<BookingEntity> =
		dataSource.getRepository(BookingEntity);

	// Clear in dependency order: bookings -> properties/users
	await bookingRepo.clear();
	await propertyRepo.clear();
	await userRepo.clear();

	// Create standard test property
	const property = await propertyRepo.save({
		id: "prop-1",
		title: "Cozy Cottage",
		description: "A cozy cottage in the countryside",
		maxGuests: 6,
		basePrice: 100,
	});

	// Create standard test user
	const user = await userRepo.save({
		id: "user-1",
		name: "John Doe",
	});

	return { property, user };
}

/**
 * Seeds the database with complete booking test data: property, user, and booking.
 *
 * This function:
 * 1. Calls seedTestData() to set up property and user
 * 2. Creates a confirmed booking with realistic dates and pricing
 *
 * Use this for tests that require an existing booking (e.g., cancellation, updates).
 *
 * @param dataSource - TypeORM DataSource instance
 * @returns Promise<BookingTestData> - The seeded property, user, and booking entities
 */
export async function seedBookingData(
	dataSource: DataSource,
): Promise<BookingTestData> {
	// Leverage base seeder to avoid duplication
	const { property, user } = await seedTestData(dataSource);

	const bookingRepo: Repository<BookingEntity> =
		dataSource.getRepository(BookingEntity);

	// Create a confirmed booking with standard attributes
	const booking = await bookingRepo.save({
		id: "booking-1",
		property: { id: property.id },
		guest: { id: user.id },
		startDate: new Date("2024-07-01"),
		endDate: new Date("2024-07-10"),
		guestCount: 2,
		status: "confirmed",
		totalPrice: 800,
	});

	return { property, user, booking };
}
