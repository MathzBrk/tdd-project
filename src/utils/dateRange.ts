import { DateRange } from "../domain/value_objects/date_range";

export const createDateRange = (
	overrides?: Partial<{
		startDate: Date;
		endDate: Date;
		daysFromNow: number;
		durationDays: number;
	}>,
): DateRange => {
	if (overrides?.startDate && overrides?.endDate) {
		return new DateRange(overrides.startDate, overrides.endDate);
	}

	const daysFromNow = overrides?.daysFromNow ?? 0;
	const durationDays = overrides?.durationDays ?? 7;

	const start = new Date();
	start.setDate(start.getDate() + daysFromNow);

	const end = new Date(start);
	end.setDate(start.getDate() + durationDays);

	return new DateRange(start, end);
};
