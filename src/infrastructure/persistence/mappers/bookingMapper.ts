import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/bookingEntity";
import { PropertyMapper } from "./propertyMapper";
import { UserMapper } from "./userMapper";

export class BookingMapper {
	static toDomain(entity: BookingEntity, property?: Property): Booking {
		const guest = UserMapper.toDomain(entity.guest);
		const dateRange = new DateRange(entity.startDate, entity.endDate);

		const booking = new Booking(
			entity.id,
			property ? property : PropertyMapper.toDomain(entity.property),
			guest,
			dateRange,
			entity.guestCount,
		);

		booking["totalPrice"] = entity.totalPrice;
		booking["status"] = entity.status;

		return booking;
	}

	static toPersistence(booking: Booking): BookingEntity {
		const bookingEntity = new BookingEntity();
		bookingEntity.id = booking.getId();
		bookingEntity.property = PropertyMapper.toPersistence(
			booking.getProperty(),
		);
		bookingEntity.guest = UserMapper.toPersistence(booking.getUser());
		bookingEntity.startDate = booking.getDateRange().getStartDate();
		bookingEntity.endDate = booking.getDateRange().getEndDate();
		bookingEntity.guestCount = booking.getGuestCount();
		bookingEntity.totalPrice = booking.getTotalPrice();
		bookingEntity.status = booking.getStatus();

		return bookingEntity;
	}
}
