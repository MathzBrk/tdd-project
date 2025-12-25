import { Booking } from "../../../domain/entities/booking";
import type { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/bookingEntity";
import { propertyToDomain, propertyToPersistence } from "./propertyMapper";
import { userToDomain, userToPersistence } from "./userMapper";

export const bookingToDomain = (
	entity: BookingEntity,
	property?: Property,
): Booking => {
	const guest = userToDomain(entity.guest);
	const dateRange = new DateRange(entity.startDate, entity.endDate);

	const booking = new Booking(
		entity.id,
		property ? property : propertyToDomain(entity.property),
		guest,
		dateRange,
		entity.guestCount,
	);

	booking["totalPrice"] = entity.totalPrice;
	booking["status"] = entity.status;

	return booking;
};

export const bookingToPersistence = (booking: Booking): BookingEntity => {
	const bookingEntity = new BookingEntity();
	bookingEntity.id = booking.getId();
	bookingEntity.property = propertyToPersistence(booking.getProperty());
	bookingEntity.guest = userToPersistence(booking.getUser());
	bookingEntity.startDate = booking.getDateRange().getStartDate();
	bookingEntity.endDate = booking.getDateRange().getEndDate();
	bookingEntity.guestCount = booking.getGuestCount();
	bookingEntity.totalPrice = booking.getTotalPrice();
	bookingEntity.status = booking.getStatus();

	return bookingEntity;
};
