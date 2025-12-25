import { Booking } from "../../domain/entities/booking";
import { DateRange } from "../../domain/value_objects/date_range";
import { FakeBookingRepository } from "../../infrastructure/repositories/fakeBookingRepository";
import { createPropertyForTest } from "../../utils/property";
import { createUserForTest } from "../../utils/user";
import type { CreateBookingDTO } from "../dtos/createBooking.dto";
import { BookingService } from "./bookingService";
import type { PropertyService } from "./propertyService";
import type { UserService } from "./userService";

describe("BookingService - Unit Tests", () => {
	let fakeBookingRepository: FakeBookingRepository;
	let bookingService: BookingService;
	let mockPropertyService: jest.Mocked<PropertyService>;
	let mockUserService: jest.Mocked<UserService>;

	beforeEach(() => {
		// Create proper mocks that match the service interface
		mockPropertyService = {
			findPropertyById: jest.fn(),
			saveProperty: jest.fn(),
		} as unknown as jest.Mocked<PropertyService>;

		mockUserService = {
			findUserById: jest.fn(),
			saveUser: jest.fn(),
		} as unknown as jest.Mocked<UserService>;

		fakeBookingRepository = new FakeBookingRepository();
		bookingService = new BookingService(
			fakeBookingRepository,
			mockPropertyService,
			mockUserService,
		);
	});

	describe("createBooking", () => {
		it("should create a new booking when property and user exist", async () => {
			// Arrange: Mock returns REAL domain objects
			const property = createPropertyForTest({
				id: "prop-1",
				maxGuests: 4,
				basePricePerNight: 100,
			});
			const user = createUserForTest({ id: "user-1" });

			mockPropertyService.findPropertyById.mockResolvedValue(property);
			mockUserService.findUserById.mockResolvedValue(user);

			const bookingDto: CreateBookingDTO = {
				propertyId: "prop-1",
				guestId: "user-1",
				startDate: new Date("2024-07-01"),
				endDate: new Date("2024-07-10"),
				guestCount: 2,
			};

			// Act
			const result = await bookingService.createBooking(bookingDto);

			// Assert: Verify BookingService behavior
			expect(result).toBeInstanceOf(Booking);
			expect(result.getStatus()).toBe("confirmed");
			expect(result.getProperty().getId()).toBe("prop-1");
			expect(result.getUser().getId()).toBe("user-1");
			expect(result.getGuestCount()).toBe(2);
			expect(result.getTotalPrice()).toBe(810);

			// Verify BookingService called dependencies correctly
			expect(mockPropertyService.findPropertyById).toHaveBeenCalledWith(
				"prop-1",
			);
			expect(mockUserService.findUserById).toHaveBeenCalledWith("user-1");
			expect(mockPropertyService.findPropertyById).toHaveBeenCalledTimes(1);
			expect(mockUserService.findUserById).toHaveBeenCalledTimes(1);

			// Verify it was saved in the repository
			const savedBooking = await fakeBookingRepository.findById(result.getId());
			expect(savedBooking).not.toBeNull();
			expect(savedBooking?.getId()).toBe(result.getId());
		});

		it("should throw an error when property is not found", async () => {
			// Arrange: Mock returns null (simulating PropertyService behavior)
			mockPropertyService.findPropertyById.mockResolvedValue(null);

			const bookingDto: CreateBookingDTO = {
				propertyId: "non-existent",
				guestId: "user-1",
				startDate: new Date("2024-07-01"),
				endDate: new Date("2024-07-10"),
				guestCount: 2,
			};

			// Act & Assert: Test BookingService error handling
			await expect(bookingService.createBooking(bookingDto)).rejects.toThrow(
				"Property not found",
			);

			// Verify it called PropertyService but stopped before calling UserService
			expect(mockPropertyService.findPropertyById).toHaveBeenCalledWith(
				"non-existent",
			);
			expect(mockUserService.findUserById).not.toHaveBeenCalled();
		});

		it("should throw an error when user is not found", async () => {
			// Arrange: Property exists, but user doesn't
			const property = createPropertyForTest({ id: "prop-1" });

			mockPropertyService.findPropertyById.mockResolvedValue(property);
			mockUserService.findUserById.mockResolvedValue(null);

			const bookingDto: CreateBookingDTO = {
				propertyId: "prop-1",
				guestId: "non-existent",
				startDate: new Date("2024-07-01"),
				endDate: new Date("2024-07-10"),
				guestCount: 2,
			};

			// Act & Assert
			await expect(bookingService.createBooking(bookingDto)).rejects.toThrow(
				"User not found",
			);

			// Verify both services were called
			expect(mockPropertyService.findPropertyById).toHaveBeenCalledWith(
				"prop-1",
			);
			expect(mockUserService.findUserById).toHaveBeenCalledWith("non-existent");
		});

		it("should throw an error when property is unavailable for the selected dates", async () => {
			// Arrange: Create REAL property with an existing booking
			const property = createPropertyForTest({
				id: "prop-1",
				maxGuests: 4,
				basePricePerNight: 100,
			});
			const user = createUserForTest({ id: "user-1" });

			// Add an existing booking to the property (real domain logic)
			const existingDateRange = new DateRange(
				new Date("2024-07-01"),
				new Date("2024-07-10"),
			);
			// Creating a booking modifies the property's internal bookings array
			new Booking("existing-booking", property, user, existingDateRange, 2);

			mockPropertyService.findPropertyById.mockResolvedValue(property);
			mockUserService.findUserById.mockResolvedValue(user);

			// Try to create overlapping booking
			const overlappingDto: CreateBookingDTO = {
				propertyId: "prop-1",
				guestId: "user-1",
				startDate: new Date("2024-07-05"),
				endDate: new Date("2024-07-15"),
				guestCount: 2,
			};

			// Act & Assert: The REAL Property domain logic throws the error
			await expect(
				bookingService.createBooking(overlappingDto),
			).rejects.toThrow(
				"Property is not available for the selected date range",
			);

			// Verify services were called
			expect(mockPropertyService.findPropertyById).toHaveBeenCalled();
			expect(mockUserService.findUserById).toHaveBeenCalled();
		});

		it("should throw an error when guest count exceeds property max guests", async () => {
			// Arrange: Property has max 4 guests
			const property = createPropertyForTest({
				id: "prop-1",
				maxGuests: 4,
				basePricePerNight: 100,
			});
			const user = createUserForTest({ id: "user-1" });

			mockPropertyService.findPropertyById.mockResolvedValue(property);
			mockUserService.findUserById.mockResolvedValue(user);

			const bookingDto: CreateBookingDTO = {
				propertyId: "prop-1",
				guestId: "user-1",
				startDate: new Date("2024-07-01"),
				endDate: new Date("2024-07-10"),
				guestCount: 10, // Exceeds maxGuests
			};

			// Act & Assert: Real Property validation throws error
			await expect(bookingService.createBooking(bookingDto)).rejects.toThrow(
				"Guest count exceeds maximum allowed",
			);
		});
	});

	describe("cancelBooking", () => {
		it("should cancel an existing booking", async () => {
			// Arrange: Create a booking first
			const property = createPropertyForTest({
				id: "prop-1",
				basePricePerNight: 100,
			});
			const user = createUserForTest({ id: "user-1" });

			mockPropertyService.findPropertyById.mockResolvedValue(property);
			mockUserService.findUserById.mockResolvedValue(user);

			const bookingDto: CreateBookingDTO = {
				propertyId: "prop-1",
				guestId: "user-1",
				startDate: new Date("2024-07-20"),
				endDate: new Date("2024-07-25"),
				guestCount: 2,
			};

			const booking = await bookingService.createBooking(bookingDto);
			const bookingId = booking.getId();

			// Act: Cancel the booking
			await bookingService.cancelBooking(bookingId);

			// Assert: Verify BookingService logic
			const cancelledBooking = await fakeBookingRepository.findById(bookingId);
			expect(cancelledBooking).not.toBeNull();
			expect(cancelledBooking?.getStatus()).toBe("cancelled");
		});

		it("should throw an error when trying to cancel a non-existing booking", async () => {
			// Act & Assert
			await expect(
				bookingService.cancelBooking("non-existing-id"),
			).rejects.toThrow("Booking not found");

			// Verify repository was called
			const result = await fakeBookingRepository.findById("non-existing-id");
			expect(result).toBeNull();
		});

		it("should throw an error when trying to cancel an already cancelled booking", async () => {
			// Arrange: Create and cancel a booking
			const property = createPropertyForTest({ id: "prop-1" });
			const user = createUserForTest({ id: "user-1" });

			mockPropertyService.findPropertyById.mockResolvedValue(property);
			mockUserService.findUserById.mockResolvedValue(user);

			const bookingDto: CreateBookingDTO = {
				propertyId: "prop-1",
				guestId: "user-1",
				startDate: new Date("2024-07-20"),
				endDate: new Date("2024-07-25"),
				guestCount: 2,
			};

			const booking = await bookingService.createBooking(bookingDto);
			await bookingService.cancelBooking(booking.getId());

			// Act & Assert: Try to cancel again
			await expect(
				bookingService.cancelBooking(booking.getId()),
			).rejects.toThrow("Booking is already cancelled");
		});
	});
});
