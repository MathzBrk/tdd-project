import type { DateRange } from "../value_objects/date_range";
import type { Booking } from "./booking";

export class Property {
	constructor(
		private readonly id: string,
		private readonly title: string,
		private readonly description: string,
		private readonly maxGuests: number,
		private readonly basePrice: number,
		private readonly bookings: Booking[] = [],
	) {
		if (!title) {
			throw new Error("Title cannot be empty");
		}
		if (maxGuests <= 0) {
			throw new Error("Max guests must be greater than zero");
		}
	}

	getId(): string {
		return this.id;
	}

	getTitle(): string {
		return this.title;
	}

	getDescription(): string {
		return this.description;
	}

	getMaxGuests(): number {
		return this.maxGuests;
	}

	getBasePricePerNight(): number {
		return this.basePrice;
	}

	validateGuestCount(guestCount: number): void {
		if (guestCount > this.maxGuests) {
			throw new Error(
				`Guest count exceeds maximum allowed. Max guests: ${this.maxGuests}`,
			);
		}
	}

	calculateTotalPrice(dateRange: DateRange): number {
		const totalPrice = dateRange.getTotalNights() * this.basePrice;

		if (dateRange.getTotalNights() >= 7) {
			return totalPrice * 0.9; // Apply 10% discount
		}

		return totalPrice;
	}

	isAvailable(dateRange: DateRange): boolean {
		return !this.bookings.some(
			(booking) =>
				booking.getStatus() === "confirmed" &&
				booking.getDateRange().overLaps(dateRange),
		);
	}

	addBooking(booking: Booking): void {
		this.bookings.push(booking);
	}

	getBookings(): Booking[] {
		return this.bookings;
	}
}
