import {
	createBookingForTest,
	createBookingPersistenceObject,
} from "../../../utils/booking";
import { createPropertyForTest } from "../../../utils/property";
import { bookingToDomain, bookingToPersistence } from "./bookingMapper";

describe("BookingMapper", () => {
	describe("toPersistence", () => {
		it("should map all booking fields to persistence entity", () => {
			const booking = createBookingForTest();

			const bookingEntity = bookingToPersistence(booking);

			expect(bookingEntity.id).toBe(booking.getId());
			expect(bookingEntity.guestCount).toBe(booking.getGuestCount());
			expect(bookingEntity.startDate).toBe(
				booking.getDateRange().getStartDate(),
			);
			expect(bookingEntity.endDate).toBe(booking.getDateRange().getEndDate());
			expect(bookingEntity.totalPrice).toBe(booking.getTotalPrice());
			expect(bookingEntity.status).toBe(booking.getStatus());

			expect(bookingEntity.property.id).toBe(booking.getProperty().getId());
			expect(bookingEntity.property.title).toBe(
				booking.getProperty().getTitle(),
			);
			expect(bookingEntity.property.description).toBe(
				booking.getProperty().getDescription(),
			);
			expect(bookingEntity.property.maxGuests).toBe(
				booking.getProperty().getMaxGuests(),
			);
			expect(bookingEntity.property.basePrice).toBe(
				booking.getProperty().getBasePricePerNight(),
			);

			expect(bookingEntity.guest.id).toBe(booking.getUser().getId());
			expect(bookingEntity.guest.name).toBe(booking.getUser().getName());
		});

		it("should map booking with custom guest count", () => {
			const booking = createBookingForTest({ guestCount: 5 });

			const bookingEntity = bookingToPersistence(booking);

			expect(bookingEntity.guestCount).toBe(5);
		});
	});

	describe("toDomain", () => {
		it("should map all persistence entity fields to booking domain", () => {
			const bookingPersistence = createBookingPersistenceObject();

			const booking = bookingToDomain(bookingPersistence);

			expect(booking.getId()).toBe(bookingPersistence.id);
			expect(booking.getGuestCount()).toBe(bookingPersistence.guestCount);
			expect(booking.getDateRange().getStartDate()).toBe(
				bookingPersistence.startDate,
			);
			expect(booking.getDateRange().getEndDate()).toBe(
				bookingPersistence.endDate,
			);
			expect(booking.getTotalPrice()).toBe(bookingPersistence.totalPrice);
			expect(booking.getStatus()).toBe(bookingPersistence.status);

			expect(booking.getProperty().getId()).toBe(
				bookingPersistence.property.id,
			);
			expect(booking.getProperty().getTitle()).toBe(
				bookingPersistence.property.title,
			);
			expect(booking.getProperty().getDescription()).toBe(
				bookingPersistence.property.description,
			);
			expect(booking.getProperty().getMaxGuests()).toBe(
				bookingPersistence.property.maxGuests,
			);
			expect(booking.getProperty().getBasePricePerNight()).toBe(
				bookingPersistence.property.basePrice,
			);

			expect(booking.getUser().getId()).toBe(bookingPersistence.guest.id);
			expect(booking.getUser().getName()).toBe(bookingPersistence.guest.name);
		});

		it("should throw validation error when guest count is zero", () => {
			const bookingPersistence = createBookingPersistenceObject({
				guestCount: 0,
			});

			expect(() => bookingToDomain(bookingPersistence)).toThrow(
				"Guest count must be greater than zero",
			);
		});

		it("should throw validation error when guest count is negative", () => {
			const bookingPersistence = createBookingPersistenceObject({
				guestCount: -1,
			});

			expect(() => bookingToDomain(bookingPersistence)).toThrow(
				"Guest count must be greater than zero",
			);
		});

		it("should throw validation error when guest count exceeds property max guests", () => {
			const bookingPersistence = createBookingPersistenceObject({
				guestCount: 100,
			});

			expect(() => bookingToDomain(bookingPersistence)).toThrow(
				"Guest count exceeds maximum allowed",
			);
		});

		it("should use provided property instead of mapping from entity", () => {
			const bookingPersistence = createBookingPersistenceObject();
			const customProperty = createPropertyForTest({
				id: "custom-property-id",
				title: "Custom Property",
			});

			const booking = bookingToDomain(bookingPersistence, customProperty);

			expect(booking.getProperty().getId()).toBe("custom-property-id");
			expect(booking.getProperty().getTitle()).toBe("Custom Property");
			expect(booking.getProperty().getId()).not.toBe(
				bookingPersistence.property.id,
			);
		});

		it("should map booking with different status", () => {
			const bookingPersistence = createBookingPersistenceObject({
				status: "cancelled",
			});

			const booking = bookingToDomain(bookingPersistence);

			expect(booking.getStatus()).toBe("cancelled");
		});
	});
});
