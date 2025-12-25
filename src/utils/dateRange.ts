import { DateRange } from "../domain/value_objects/date_range";

interface DateRangeFactoryParams {
	startDate?: Date;
	endDate?: Date;
	daysFromNow?: number;
	durationDays?: number;
}

interface DateRangeFactoryOptions extends DateRangeFactoryParams {
	/**
	 * If true, provides test defaults for date calculations.
	 * If false, requires explicit dates or throws validation errors.
	 * @default true (DateRange is typically used with calculated dates in tests)
	 */
	isTesting?: boolean;
}

/**
 * Factory for creating DateRange value objects.
 *
 * @param options - Configuration for date range creation
 * @param options.isTesting - If true, uses relative date calculations (default: true)
 *
 * @example
 * // In production code (requires explicit dates)
 * const dateRange = createDateRange({
 *   startDate: new Date(dto.startDate),
 *   endDate: new Date(dto.endDate),
 * });
 *
 * @example
 * // In tests (calculates relative dates)
 * const dateRange = createDateRange({ isTesting: true });
 * const customRange = createDateRange({
 *   isTesting: true,
 *   daysFromNow: 7,
 *   durationDays: 14,
 * });
 */
export const createDateRange = (
	options: DateRangeFactoryOptions = {},
): DateRange => {
	const { isTesting = true, ...params } = options;

	// If explicit dates are provided, use them regardless of mode
	if (params.startDate && params.endDate) {
		return new DateRange(params.startDate, params.endDate);
	}

	// In testing mode, calculate dates relative to now
	if (isTesting) {
		const daysFromNow = params.daysFromNow ?? 0;
		const durationDays = params.durationDays ?? 7;

		const start = new Date();
		start.setDate(start.getDate() + daysFromNow);

		const end = new Date(start);
		end.setDate(start.getDate() + durationDays);

		return new DateRange(start, end);
	}

	// In production mode, require explicit dates
	// DateRange constructor will validate and throw appropriate errors
	return new DateRange(
		params.startDate ?? new Date(NaN),
		params.endDate ?? new Date(NaN),
	);
};

/**
 * Convenience function for creating test date ranges.
 * Alias for createDateRange({ isTesting: true, ...overrides })
 *
 * @param overrides - Optional values to override test defaults
 */
export const createDateRangeForTest = (
	overrides?: DateRangeFactoryParams,
): DateRange => {
	return createDateRange({ isTesting: true, ...overrides });
};
