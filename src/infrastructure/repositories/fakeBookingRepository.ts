import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/bookingRepository";

export class FakeBookingRepository implements BookingRepository {
	constructor(private bookings: Booking[] = []) {}

	async findById(bookingId: string): Promise<Booking | null> {
		const booking = this.bookings.find((b) => b.getId() === bookingId);
		return booking || null;
	}

	async save(booking: Booking): Promise<void> {
		this.bookings.push(booking);
	}
}
