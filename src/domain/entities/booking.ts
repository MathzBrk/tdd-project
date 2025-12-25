import { createRefundRule } from "../cancelation/refund_rule.factory";
import type { DateRange } from "../value_objects/date_range";
import type { Property } from "./property";
import type { User } from "./user";

export class Booking {
	constructor(
		private id: string,
		private property: Property,
		private user: User,
		private dateRange: DateRange,
		private guestCount: number,
		private status: "confirmed" | "cancelled" | "completed" = "confirmed",
		private totalPrice: number = property.calculateTotalPrice(dateRange),
	) {
		if (guestCount <= 0)
			throw new Error("Guest count must be greater than zero");
		property.validateGuestCount(guestCount);

		if (!property.isAvailable(dateRange)) {
			throw new Error("Property is not available for the selected date range");
		}
		this.status = "confirmed";

		property.addBooking(this);
	}

	cancel(currentDate: Date): void {
		if (this.status === "cancelled") {
			throw new Error("Booking is already cancelled");
		}

		const checkInDate = this.dateRange.getStartDate();
		const timeDiff = checkInDate.getTime() - currentDate.getTime();
		const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

		const refundRule = createRefundRule(daysDiff);

		this.totalPrice = refundRule.calculateRefund(this.totalPrice);

		this.status = "cancelled";
	}

	getId(): string {
		return this.id;
	}

	getProperty(): Property {
		return this.property;
	}

	getUser(): User {
		return this.user;
	}

	getDateRange(): DateRange {
		return this.dateRange;
	}

	getTotalPrice(): number {
		return this.totalPrice;
	}

	getGuestCount(): number {
		return this.guestCount;
	}

	getStatus(): "confirmed" | "cancelled" | "completed" {
		return this.status;
	}
}
