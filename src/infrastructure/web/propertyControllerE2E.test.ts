import express from "express";
import request from "supertest";
import type { TestContainer } from "../../utils/tests/testContainer";
import { createTestContainer } from "../../utils/tests/testContainer";
import { seedTestData } from "../../utils/tests/testSeeder";

describe("PropertyController E2E", () => {
	let container: TestContainer;
	let app: express.Application;

	beforeAll(async () => {
		app = express();
		app.use(express.json());

		container = await createTestContainer();

		app.post("/properties", (req, res, next) => {
			container.controllers.propertyController
				.createProperty(req, res, next)
				.catch((err) => next(err));
		});
	}, 30000);

	afterAll(async () => {
		await container.cleanup();
	});

	beforeEach(async () => {
		await seedTestData(container.dataSource);
	});

	it("should create a property successfully", async () => {
		const response = await request(app).post("/properties").send({
			title: "Modern Apartment",
			description: "A modern apartment in the city center",
			pricePerNight: 150,
			maxGuests: 4,
		});

		expect(response.body).toHaveProperty(
			"message",
			"Property created successfully",
		);
		expect(response.status).toBe(201);
	});

	it("should return 400 if the title is missing", async () => {
		const response = await request(app).post("/properties").send({
			description: "A modern apartment in the city center",
			pricePerNight: 150,
			maxGuests: 4,
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Title cannot be empty");
	});

	it("should return 400 if base price per night is null", async () => {
		const response = await request(app).post("/properties").send({
			title: "Modern Apartment",
			description: "A modern apartment in the city center",
			pricePerNight: null,
			maxGuests: 4,
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"message",
			"Invalid base price for property",
		);
	});

	it("should return 400 if max guests is zero", async () => {
		const response = await request(app).post("/properties").send({
			title: "Modern Apartment",
			description: "A modern apartment in the city center",
			pricePerNight: 150,
			maxGuests: 0,
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty(
			"message",
			"Max guests must be greater than zero",
		);
	});
});
