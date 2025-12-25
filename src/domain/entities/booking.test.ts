import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Booking Entity", () => {
	it("It should create a new booking instance with all attributes", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);

		const user = new User("1", "Matheus Borges");

		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-10"),
		);

		const booking = new Booking("1", property, user, dateRange, 4);

		expect(booking.getId()).toBe("1");
		expect(booking.getProperty()).toBe(property);
		expect(booking.getUser()).toBe(user);
		expect(booking.getDateRange()).toBe(dateRange);
		expect(booking.getGuestCount()).toBe(4);
	});

	it("It should throw an when guest count is 0 or negative", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);
		const user = new User("1", "Matheus Borges");

		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-10"),
		);

		expect(() => {
			new Booking("1", property, user, dateRange, 0);
		}).toThrow("Guest count must be greater than zero");
	});

	it("It should calculate total price with discount", () => {
		//Arrange
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);

		const user = new User("1", "Matheus Borges");

		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-10"),
		);

		//act
		const booking = new Booking("1", property, user, dateRange, 4);

		//assert
		expect(booking.getTotalPrice()).toBe(200 * 9 * 0.9); // 10% discount for 9 nights
	});

	it("It should not book when a property is unavailable", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);

		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-10"),
		);

		const user = new User("1", "Matheus Borges");

		new Booking("1", property, user, dateRange, 2);

		const dateRange2 = new DateRange(
			new Date("2024-07-05"),
			new Date("2024-07-15"),
		);

		expect(() => {
			new Booking("2", property, user, dateRange2, 2);
		}).toThrow("Property is not available for the selected date range");
	});

	it("It should cancel a booking without reimbursement when there is less than 1 day left to check-in", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			300,
		);

		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-03"),
		);

		const user = new User("1", "Matheus Borges");

		const booking = new Booking("1", property, user, dateRange, 2);

		const currentDate = new Date("2024-07-01");

		booking.cancel(currentDate);

		expect(booking.getStatus()).toBe("cancelled");
		expect(booking.getTotalPrice()).toBe(600); // No reimbursement
	});

	it("It should cancel a booking with 100% reimbursement when the date is more than 7 days before to check-in", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			300,
		);

		const dateRange = new DateRange(
			new Date("2024-07-20"),
			new Date("2024-07-25"),
		);

		const user = new User("1", "Matheus Borges");

		const booking = new Booking("1", property, user, dateRange, 2);

		const currentDate = new Date("2024-07-10");

		booking.cancel(currentDate);

		expect(booking.getStatus()).toBe("cancelled");
		expect(booking.getTotalPrice()).toBe(0); // No reimbursement
	});

	it("It should cancel a booking with partial reimbursement when the date is between 1 and 7 days before to check-in", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			300,
		);

		const dateRange = new DateRange(
			new Date("2024-07-20"),
			new Date("2024-07-25"),
		);

		const user = new User("1", "Matheus Borges");

		const booking = new Booking("1", property, user, dateRange, 2);

		const currentDate = new Date("2024-07-15");

		booking.cancel(currentDate);

		expect(booking.getStatus()).toBe("cancelled");
		expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
	});

	it("It should not allow to cancel the same booking twice", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			300,
		);

		const dateRange = new DateRange(
			new Date("2024-07-20"),
			new Date("2024-07-25"),
		);

		const user = new User("1", "Matheus Borges");

		const booking = new Booking("1", property, user, dateRange, 2);

		const currentDate = new Date("2024-07-15");

		booking.cancel(currentDate);

		expect(() => {
			booking.cancel(currentDate);
		}).toThrow("Booking is already cancelled");
	});
});
