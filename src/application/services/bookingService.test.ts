import { Booking } from "../../domain/entities/booking";
import { FakeBookingRepository } from "../../infrastructure/repositories/fakeBookingRepository";
import type { CreateBookingDTO } from "../dtos/createBooking.dto";
import { BookingService } from "./bookingService";
import { PropertyService } from "./propertyService";
import { UserService } from "./userService";

jest.mock("./propertyService");
jest.mock("./userService");
describe("Booking Service", () => {
	let fakeBookingRepository: FakeBookingRepository;
	let bookingService: BookingService;
	let mockPropertyService: jest.Mocked<PropertyService>;
	let mockUserService: jest.Mocked<UserService>;

	beforeEach(() => {
		const mockPropertyRepository = {} as any;
		const mockUserRepository = {} as any;

		mockPropertyService = new PropertyService(
			mockPropertyRepository,
		) as jest.Mocked<PropertyService>;

		mockUserService = new UserService(
			mockUserRepository,
		) as jest.Mocked<UserService>;

		fakeBookingRepository = new FakeBookingRepository();
		bookingService = new BookingService(
			fakeBookingRepository,
			mockPropertyService,
			mockUserService,
		);
	});
	it("should create a new booking using the repository", async () => {
		const mockProperty = {
			getId: jest.fn().mockReturnValue("1"),
			isAvailable: jest.fn().mockReturnValue(true),
			validateGuestCount: jest.fn(),
			calculateTotalPrice: jest.fn().mockReturnValue(1000),
			addBooking: jest.fn(),
		} as any;

		const mockUser = {
			getId: jest.fn().mockReturnValue("1"),
		} as any;

		mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
		mockUserService.findUserById.mockResolvedValue(mockUser);

		const bockingDto: CreateBookingDTO = {
			propertyId: "1",
			guestId: "1",
			startDate: new Date("2024-07-01"),
			endDate: new Date("2024-07-10"),
			guestCount: 2,
		};
		const result = await bookingService.createBooking(bockingDto);

		expect(result).toBeInstanceOf(Booking);
		expect(result.getStatus()).toBe("confirmed");
		expect(result.getProperty().getId()).toBe(bockingDto.propertyId);
		expect(result.getTotalPrice()).toBe(1000);

		const savedBooking = await fakeBookingRepository.findById(result.getId());
		expect(savedBooking).not.toBeNull();
		expect(savedBooking?.getId()).toBe(result.getId());
	});

	it("should throw an error when property is not found", async () => {
		mockPropertyService.findPropertyById.mockResolvedValue(null);

		const bockingDto: CreateBookingDTO = {
			propertyId: "1",
			guestId: "1",
			startDate: new Date("2024-07-01"),
			endDate: new Date("2024-07-10"),
			guestCount: 2,
		};

		await expect(bookingService.createBooking(bockingDto)).rejects.toThrow(
			"Property not found",
		);
	});

	it("should throw an error when guest is not found", async () => {
		const mockProperty = {
			getId: jest.fn().mockReturnValue("1"),
			isAvailable: jest.fn().mockReturnValue(true),
			validateGuestCount: jest.fn(),
			calculateTotalPrice: jest.fn().mockReturnValue(1000),
			addBooking: jest.fn(),
		} as any;

		mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
		mockUserService.findUserById.mockResolvedValue(null);

		const bockingDto: CreateBookingDTO = {
			propertyId: "1",
			guestId: "1",
			startDate: new Date("2024-07-01"),
			endDate: new Date("2024-07-10"),
			guestCount: 2,
		};

		await expect(bookingService.createBooking(bockingDto)).rejects.toThrow(
			"User not found",
		);
	});

	it("should throw an error when tried to create a booking with overlapping dates", async () => {
		const mockProperty = {
			getId: jest.fn().mockReturnValue("1"),
			isAvailable: jest.fn().mockReturnValue(true),
			validateGuestCount: jest.fn(),
			calculateTotalPrice: jest.fn().mockReturnValue(1000),
			addBooking: jest.fn(),
		} as any;

		const mockUser = {
			getId: jest.fn().mockReturnValue("1"),
		} as any;

		mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
		mockUserService.findUserById.mockResolvedValue(mockUser);

		const bockingDto: CreateBookingDTO = {
			propertyId: "1",
			guestId: "1",
			startDate: new Date("2024-07-01"),
			endDate: new Date("2024-07-10"),
			guestCount: 2,
		};
		await bookingService.createBooking(bockingDto);

		mockProperty.isAvailable.mockReturnValue(false);
		mockProperty.addBooking.mockImplementationOnce(() => {
			throw new Error("Property is not available for the selected date range");
		});

		await expect(bookingService.createBooking(bockingDto)).rejects.toThrow(
			"Property is not available for the selected date range",
		);
	});

	it("should cancell a existing booking", async () => {
		const mockProperty = {
			getId: jest.fn().mockReturnValue("1"),
			isAvailable: jest.fn().mockReturnValue(true),
			validateGuestCount: jest.fn(),
			calculateTotalPrice: jest.fn().mockReturnValue(1000),
			addBooking: jest.fn(),
		} as any;

		const mockUser = {
			getId: jest.fn().mockReturnValue("1"),
		} as any;

		mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
		mockUserService.findUserById.mockResolvedValue(mockUser);

		const bockingDto: CreateBookingDTO = {
			propertyId: "1",
			guestId: "1",
			startDate: new Date("2024-07-01"),
			endDate: new Date("2024-07-10"),
			guestCount: 2,
		};
		const result = await bookingService.createBooking(bockingDto);

		const spyFindById = jest.spyOn(fakeBookingRepository, "findById");

		await bookingService.cancelBooking(result.getId());

		const cancelledBooking = await fakeBookingRepository.findById(
			result.getId(),
		);

		expect(cancelledBooking).not.toBeNull();
		expect(cancelledBooking?.getStatus()).toBe("cancelled");
		expect(spyFindById).toHaveBeenCalledWith(result.getId());
		expect(spyFindById).toHaveBeenCalledTimes(2);
		spyFindById.mockRestore();
	});
});
