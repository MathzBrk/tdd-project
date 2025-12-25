import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Property Entity", () => {
	it("It should create a new property instance with all attributes", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);

		expect(property.getId()).toBe("1");
		expect(property.getTitle()).toBe("Beautiful House");
		expect(property.getDescription()).toBe("A lovely 3-bedroom house");
		expect(property.getMaxGuests()).toBe(4);
		expect(property.getBasePricePerNight()).toBe(200);
	});

	it("It should throw an error when title is empty", () => {
		expect(() => {
			new Property("1", "", "A lovely 3-bedroom house", 4, 200);
		}).toThrow("Title cannot be empty");
	});

	it("It should throw an error when maxGuests is zero or negative", () => {
		expect(() => {
			new Property("1", "Beautiful House", "A lovely 3-bedroom house", 0, 200);
		}).toThrow("Max guests must be greater than zero");
	});

	it("It should validate the number of max guests", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);

		expect(() => {
			property.validateGuestCount(6);
		}).toThrow("Guest count exceeds maximum allowed. Max guests: 4");
	});

	it("It should not apply discount for bookings less than 7 nights", () => {
		const property = new Property(
			"1",
			"Beautiful House",
			"A lovely 3-bedroom house",
			4,
			200,
		);

		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-06"),
		);

		const totalPrice = property.calculateTotalPrice(dateRange);
		expect(totalPrice).toBe(1000); // 5 nights * $200
	});

	it("It should apply discount for bookings of 7 nights or more", () => {
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

		const totalPrice = property.calculateTotalPrice(dateRange);
		expect(totalPrice).toBe(1620); // 9 nights * $200 with 10% discount
	});

	it("It should verify property availability for given date range", () => {
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

		const dateRange2 = new DateRange(
			new Date("2024-07-05"),
			new Date("2024-07-15"),
		);

		const user = new User("1", "Matheus Borges");

		new Booking("1", property, user, dateRange, 2);

		expect(property.isAvailable(dateRange2)).toBe(false);
		expect(property.isAvailable(dateRange)).toBe(false);
	});

	it("It should add a booking to the property", () => {
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

		const booking = new Booking("1", property, user, dateRange, 2);

		expect(property.getBookings()).toContain(booking);
	});

	it("It should return all bookings of the property", () => {
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

		const dateRange2 = new DateRange(
			new Date("2024-08-01"),
			new Date("2024-08-10"),
		);

		const user = new User("1", "Matheus Borges");

		const booking1 = new Booking("1", property, user, dateRange, 2);
		const booking2 = new Booking("2", property, user, dateRange2, 3);

		const bookings = property.getBookings();

		expect(bookings).toHaveLength(2);
		expect(bookings).toContain(booking1);
		expect(bookings).toContain(booking2);
	});
});
