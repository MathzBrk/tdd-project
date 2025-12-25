import express from "express";
import request from "supertest";
import type { TestContainer } from "../../utils/tests/testContainer";
import { createTestContainer } from "../../utils/tests/testContainer";
import { seedBookingData, seedTestData } from "../../utils/tests/testSeeder";

const app = express();
app.use(express.json());

let container: TestContainer;

beforeAll(async () => {
	// Initialize complete test container with all dependencies
	container = await createTestContainer();

	// Register routes with controller from container
	app.post("/bookings", (req, res, next) => {
		container.controllers.bookingController
			.createBooking(req, res, next)
			.catch((err) => next(err));
	});

	app.post("/bookings/:id/cancel", (req, res, next) => {
		container.controllers.bookingController
			.cancelBooking(req, res, next)
			.catch((err) => next(err));
	});
}, 30000);

afterAll(async () => {
	// Clean up database connection
	await container.cleanup();
});

describe("BookingController E2E", () => {
	beforeEach(async () => {
		// Seed basic test data for each test
		await seedTestData(container.dataSource);
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
		// Seed data with an existing booking
		await seedBookingData(container.dataSource);

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
