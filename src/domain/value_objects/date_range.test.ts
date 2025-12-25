import { DateRange } from "./date_range";

describe("Date Range Value Object", () => {
	it("It should create an instance of DateRange that has a start date before the end date and verify the return of both", () => {
		const startDate = new Date("2024-01-01");
		const endDate = new Date("2024-01-10");
		const dateRange = new DateRange(startDate, endDate);
		expect(dateRange.getStartDate()).toEqual(startDate);
		expect(dateRange.getEndDate()).toEqual(endDate);
	});

	it("It should thrown an error when the end date is before the start date", () => {
		expect(() => {
			new DateRange(new Date("2024-01-10"), new Date("2024-01-05"));
		}).toThrow("End date must be after start date");
	});

	it("It should calculate the total of nights correctly", () => {
		const startDate = new Date("2024-01-01");
		const endDate = new Date("2024-01-10");
		const dateRange = new DateRange(startDate, endDate);
		const totalNights = dateRange.getTotalNights();

		expect(totalNights).toBe(9);
	});

	it("It should verify if two date intervals overlap", () => {
		const dateRange1 = new DateRange(
			new Date("2024-12-20"),
			new Date("2024-12-25"),
		);

		const dateRange2 = new DateRange(
			new Date("2024-12-22"),
			new Date("2024-12-27"),
		);

		const overlaps = dateRange1.overLaps(dateRange2);

		expect(overlaps).toBe(true);
	});

	// Edges cases
	it("it should throw an error if start date and end date are the same", () => {
		const date = new Date("2024-05-01");

		expect(() => {
			new DateRange(date, date);
		}).toThrow("Start date and end date cannot be the same");
	});
});
