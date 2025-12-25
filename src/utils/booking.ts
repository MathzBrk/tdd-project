import { Booking } from "../domain/entities/booking";
import type { Property } from "../domain/entities/property";
import type { User } from "../domain/entities/user";
import { BookingEntity } from "../infrastructure/persistence/entities/bookingEntity";
import { createDateRange } from "./dateRange";
import { createProperty, createPropertyPersistenceObject } from "./property";
import { createUser, createUserPersistenceObject } from "./user";

export const createBooking = (
	overrides?: Partial<{
		id: string;
		property: Property;
		guest: User;
		daysFromNow: number;
		durationDays: number;
		guestCount: number;
	}>,
): Booking => {
	const property = overrides?.property ?? createProperty();
	const guest = overrides?.guest ?? createUser();
	const dateRange = createDateRange({
		daysFromNow: overrides?.daysFromNow,
		durationDays: overrides?.durationDays,
	});

	return new Booking(
		overrides?.id ?? "test-booking-id",
		property,
		guest,
		dateRange,
		overrides?.guestCount ?? 2,
	);
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
