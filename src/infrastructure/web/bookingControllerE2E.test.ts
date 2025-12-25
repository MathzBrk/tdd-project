import express from "express";
import e from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { BookingService } from "../../application/services/bookingService";
import { PropertyService } from "../../application/services/propertyService";
import { UserService } from "../../application/services/userService";
import { BookingRepository } from "../../domain/repositories/bookingRepository";
import { PropertyRepository } from "../../domain/repositories/propertyRepository";
import { UserRepository } from "../../domain/repositories/userRepository";
import { BookingEntity } from "../persistence/entities/bookingEntity";
import { PropertyEntity } from "../persistence/entities/propertyEntity";
import { UserEntity } from "../persistence/entities/userEntity";
import { TypeORMBookingRepository } from "../repositories/typeORM.booking.repository";
import { TypeORMPropertyRepository } from "../repositories/typeORM.property.repository";
import { TypeORMUserRepository } from "../repositories/typeORM.user.repository";
import { BookingController } from "./bookingController";

const app = express();
app.use(express.json());

let dataSource: DataSource;

let bookingRepository: BookingRepository;
let propertyRepository: PropertyRepository;
let userRepository: UserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

beforeAll(async () => {
	dataSource = new DataSource({
		type: "sqlite",
		database: ":memory:",
		entities: [BookingEntity, PropertyEntity, UserEntity],
		synchronize: true,
		logging: false,
		dropSchema: true,
	});
	await dataSource.initialize();
	bookingRepository = new TypeORMBookingRepository(
		dataSource.getRepository(BookingEntity),
	);
	propertyRepository = new TypeORMPropertyRepository(
		dataSource.getRepository(PropertyEntity),
	);
	userRepository = new TypeORMUserRepository(
		dataSource.getRepository(UserEntity),
	);
	propertyService = new PropertyService(propertyRepository);
	userService = new UserService(userRepository);
	bookingService = new BookingService(
		bookingRepository,
		propertyService,
		userService,
	);

	bookingController = new BookingController(bookingService);

	app.post("/bookings", (req, res, next) => {
		bookingController.createBooking(req, res, next).catch((err) => next(err));
	});

	app.post("/bookings/:id/cancel", (req, res, next) => {
		bookingController.cancelBooking(req, res, next).catch((err) => next(err));
	});
}, 30000);

afterAll(async () => {
	await dataSource.destroy();
});

const specialCaseForCancelingABooking = async () => {
	const propertyRepo = dataSource.getRepository(PropertyEntity);
	const userRepo = dataSource.getRepository(UserEntity);
	const bookingRepo = dataSource.getRepository(BookingEntity);

	await bookingRepo.clear();
	await propertyRepo.clear();
	await userRepo.clear();

	await propertyRepo.save({
		id: "prop-1",
		title: "Cozy Cottage",
		description: "A cozy cottage in the countryside",
		maxGuests: 6,
		basePrice: 100,
	});

	await userRepo.save({
		id: "user-1",
		name: "John Doe",
	});

	await bookingRepo.save({
		id: "booking-1",
		property: { id: "prop-1" },
		guest: { id: "user-1" },
		startDate: new Date("2024-07-01"),
		endDate: new Date("2024-07-10"),
		guestCount: 2,
		status: "confirmed",
		totalPrice: 800,
	});
};

describe("BookingController E2E", () => {
	beforeEach(async () => {
		// Seed initial data for properties and users
		const propertyRepo = dataSource.getRepository(PropertyEntity);
		const userRepo = dataSource.getRepository(UserEntity);
		const bookingRepo = dataSource.getRepository(BookingEntity);

		await bookingRepo.clear();
		await propertyRepo.clear();
		await userRepo.clear();

		await propertyRepo.save({
			id: "prop-1",
			title: "Cozy Cottage",
			description: "A cozy cottage in the countryside",
			maxGuests: 6,
			basePrice: 100,
		});

		await userRepo.save({
			id: "user-1",
			name: "John Doe",
		});
	});

	it("should create a booking successfully", async () => {
		const response = await request(app).post("/bookings").send({
			propertyId: "prop-1",
			userId: "user-1",
			startDate: "2024-07-01",
			endDate: "2024-07-10",
			guestCount: 4,
		});

		expect(response.body).toHaveProperty(
			"message",
			"Booking created successfully",
		);
		expect(response.status).toBe(201);
	});

	it("should return 400 if start date is invalid", async () => {
		const response = await request(app).post("/bookings").send({
			propertyId: "prop-1",
			userId: "user-1",
			startDate: "invalid-date",
			endDate: "2024-07-10",
			guestCount: 4,
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"message",
			"Start date or end date is invalid",
		);
	});

	it("should return 400 if end date is invalid", async () => {
		const response = await request(app).post("/bookings").send({
			propertyId: "prop-1",
			userId: "user-1",
			startDate: "2024-07-01",
			endDate: "invalid-date",
			guestCount: 4,
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"message",
			"Start date or end date is invalid",
		);
	});

	it("should return 400 if the number of guests exceeds property maxGuests", async () => {
		const response = await request(app).post("/bookings").send({
			propertyId: "prop-1",
			userId: "user-1",
			startDate: "2024-07-01",
			endDate: "2024-07-10",
			guestCount: 10, // Exceeds maxGuests of 6
		});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"message",
			`Guest count exceeds maximum allowed. Max guests: 6`,
		);
	});

	it("should return 400 if the property does not exist", async () => {
		const response = await request(app).post("/bookings").send({
			propertyId: "non-existent-prop",
			userId: "user-1",
			startDate: "2024-07-01",
			endDate: "2024-07-10",
			guestCount: 2,
		});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Property not found");
	});

	it("should return 400 if the user does not exist", async () => {
		const response = await request(app).post("/bookings").send({
			propertyId: "prop-1",
			userId: "non-existent-user",
			startDate: "2024-07-01",
			endDate: "2024-07-10",
			guestCount: 2,
		});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "User not found");
	});

	it("should cancel a booking successfully", async () => {
		await specialCaseForCancelingABooking();

		const response = await request(app)
			.post("/bookings/booking-1/cancel")
			.send({
				userId: "user-1",
			});
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Booking canceled successfully",
		);
	});

	it("it should throw an error when trying to cancel a non-existing booking", async () => {
		const response = await request(app)
			.post("/bookings/non-existent-booking/cancel")
			.send({
				userId: "user-1",
			});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Booking not found");
	});
});
