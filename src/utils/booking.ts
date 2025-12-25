import { Booking } from "../domain/entities/booking";
import type { Property } from "../domain/entities/property";
import type { User } from "../domain/entities/user";
import { BookingEntity } from "../infrastructure/persistence/entities/bookingEntity";
import { createDateRange } from "./dateRange";
import {
	createProperty,
	createPropertyForTest,
	createPropertyPersistenceObject,
} from "./property";
import { createUser, createUserForTest, createUserPersistenceObject } from "./user";

interface BookingFactoryParams {
	id?: string;
	property?: Property;
	guest?: User;
	daysFromNow?: number;
	durationDays?: number;
	guestCount?: number;
}

interface BookingFactoryOptions extends BookingFactoryParams {
	/**
	 * If true, provides test defaults for missing fields.
	 * If false, throws validation errors for missing required fields.
	 * @default false
	 */
	isTesting?: boolean;
}

/**
 * Factory for creating Booking domain entities.
 *
 * @param options - Configuration for booking creation
 * @param options.isTesting - If true, uses test defaults for missing fields
 *
 * @example
 * // In production code (requires all fields)
 * const booking = createBooking({
 *   id: uuidv4(),
 *   property: propertyEntity,
 *   guest: userEntity,
 *   daysFromNow: 0,
 *   durationDays: 7,
 *   guestCount: 2,
 * });
 *
 * @example
 * // In tests (provides defaults)
 * const booking = createBooking({ isTesting: true });
 * const customBooking = createBooking({
 *   isTesting: true,
 *   guestCount: 5,
 * });
 */
export const createBooking = (options: BookingFactoryOptions = {}): Booking => {
	const { isTesting = false, ...params } = options;

	// In testing mode, provide defaults
	if (isTesting) {
		const property = params.property ?? createPropertyForTest();
		const guest = params.guest ?? createUserForTest();
		const dateRange = createDateRange({
			isTesting: true,
			daysFromNow: params.daysFromNow,
			durationDays: params.durationDays,
		});

		return new Booking(
			params.id ?? "test-booking-id",
			property,
			guest,
			dateRange,
			params.guestCount ?? 2,
		);
	}

	// In production mode, require all fields
	// Booking constructor will validate and throw appropriate errors
	const property =
		params.property ?? createProperty({ id: "", title: "", description: "", maxGuests: 0, basePricePerNight: 0 });
	const guest = params.guest ?? createUser({ id: "", name: "" });
	const dateRange = createDateRange({
		isTesting: false,
		daysFromNow: params.daysFromNow,
		durationDays: params.durationDays,
	});

	return new Booking(
		params.id ?? "",
		property,
		guest,
		dateRange,
		params.guestCount ?? 0,
	);
};

/**
 * Convenience function for creating test bookings.
 * Alias for createBooking({ isTesting: true, ...overrides })
 *
 * @param overrides - Optional values to override test defaults
 */
export const createBookingForTest = (
	overrides?: BookingFactoryParams,
): Booking => {
	return createBooking({ isTesting: true, ...overrides });
};

export const createBookingPersistenceObject = (
	overrides?: Partial<{
		id: string;
		propertyId: string;
		guestId: string;
		daysFromNow: number;
		durationDays: number;
		guestCount: number;
		totalPrice: number;
		status: "confirmed" | "cancelled" | "completed";
	}>,
): BookingEntity => {
	const property = createPropertyPersistenceObject({
		id: overrides?.propertyId,
	});
	const guest = createUserPersistenceObject({
		id: overrides?.guestId,
	});
	const dateRange = createDateRange({
		daysFromNow: overrides?.daysFromNow,
		durationDays: overrides?.durationDays,
	});

	const bookingEntity = new BookingEntity();
	bookingEntity.id = overrides?.id ?? "test-booking-id";
	bookingEntity.property = property;
	bookingEntity.guest = guest;
	bookingEntity.startDate = dateRange.getStartDate();
	bookingEntity.endDate = dateRange.getEndDate();
	bookingEntity.guestCount = overrides?.guestCount ?? 2;
	bookingEntity.totalPrice = overrides?.totalPrice ?? 700;
	bookingEntity.status = overrides?.status ?? "confirmed";

	return bookingEntity;
};
