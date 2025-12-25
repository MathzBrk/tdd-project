export class DateRange {
	constructor(
		private startDate: Date,
		private endDate: Date,
	) {
		this.validateDates(startDate, endDate);
	}

	private validateDates(startDate: Date, endDate: Date): void {
		if (startDate === endDate) {
			throw new Error("Start date and end date cannot be the same");
		}

		if (endDate < startDate) {
			throw new Error("End date must be after start date");
		}
	}

	getStartDate(): Date {
		return this.startDate;
	}

	getEndDate(): Date {
		return this.endDate;
	}

	getTotalNights(): number {
		const millisecondsPerNight = 1000 * 60 * 60 * 24;
		const totalMilliseconds = this.endDate.getTime() - this.startDate.getTime();
		return Math.ceil(totalMilliseconds / millisecondsPerNight);
	}

	overLaps(other: DateRange): boolean {
		return (
			this.startDate < other.getEndDate() && other.getStartDate() < this.endDate
		);
	}
}
