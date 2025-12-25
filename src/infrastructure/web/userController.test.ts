import express from "express";
import request from "supertest";
import {
	createTestContainer,
	type TestContainer,
} from "../../utils/tests/testContainer";

describe("UserController E2E", () => {
	let app: express.Application;
	let container: TestContainer;

	beforeAll(async () => {
		app = express();
		app.use(express.json());

		container = await createTestContainer();

		app.post("/users", (req, res, next) => {
			container.controllers.userController
				.createUser(req, res, next)
				.catch((err) => next(err));
		});
	});

	afterAll(async () => {
		await container.cleanup();
	});

	it("should create a user successfully", async () => {
		const response = await request(app).post("/users").send({
			name: "johndoe",
		});

		expect(response.body).toHaveProperty(
			"message",
			"User created successfully",
		);
		expect(response.status).toBe(201);
		expect(response.body.user).toHaveProperty("id");
		expect(response.body.user).toHaveProperty("name", "johndoe");
	});

	it("should return 400 if the name is missing", async () => {
		const response = await request(app).post("/users").send({});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Name is required");
	});
});
