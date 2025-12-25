import type { Booking } from "../entities/booking";

export interface BookingRepository {
	findById(bookingId: string): Promise<Booking | null>;
	save(booking: Booking): Promise<void>;
}
