import type { Booking } from "../../domain/entities/booking";
import type { BookingRepository } from "../../domain/repositories/bookingRepository";

export class FakeBookingRepository implements BookingRepository {
	constructor(private bookings: Booking[] = []) {}

	async findById(bookingId: string): Promise<Booking | null> {
		const booking = this.bookings.find((b) => b.getId() === bookingId);
		return booking || null;
	}

	async save(booking: Booking): Promise<void> {
		const existingIndex = this.bookings.findIndex(
			(b) => b.getId() === booking.getId(),
		);
		if (existingIndex >= 0) {
			// Update existing booking (e.g., after cancellation)
			this.bookings[existingIndex] = booking;
		} else {
			// Add new booking
			this.bookings.push(booking);
		}
	}
}
