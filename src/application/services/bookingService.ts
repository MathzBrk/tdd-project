import { v4 as uuidv4 } from "uuid";

import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/bookingRepository";
import { DateRange } from "../../domain/value_objects/date_range";
import { CreateBookingDTO } from "../dtos/createBooking.dto";
import { PropertyService } from "./propertyService";
import { UserService } from "./userService";

export class BookingService {
	constructor(
		private bookingRepository: BookingRepository,
		private propertyService: PropertyService,
		private userService: UserService,
	) {}

	async createBooking(dto: CreateBookingDTO): Promise<Booking> {
		const property = await this.propertyService.findPropertyById(
			dto.propertyId,
		);

		if (!property) {
			throw new Error("Property not found");
		}

		const guest = await this.userService.findUserById(dto.guestId);

		if (!guest) {
			throw new Error("User not found");
		}

		const dateRange = new DateRange(dto.startDate, dto.endDate); // I need to refactor it, it need a mock

		const booking = new Booking(
			uuidv4(),
			property,
			guest,
			dateRange,
			dto.guestCount,
		);

		return await this.bookingRepository.save(booking).then(() => booking);
	}

	async cancelBooking(bookingId: string): Promise<void> {
		const booking = await this.bookingRepository.findById(bookingId);

		if (!booking) {
			throw new Error("Booking not found");
		}

		const now = new Date();

		booking.cancel(now);

		await this.bookingRepository.save(booking);
	}
}
