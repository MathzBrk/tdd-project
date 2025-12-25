import { DataSource, Repository } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { Property } from "../../domain/entities/property";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/date_range";
import { BookingEntity } from "../persistence/entities/bookingEntity";
import { PropertyEntity } from "../persistence/entities/propertyEntity";
import { UserEntity } from "../persistence/entities/userEntity";
import { TypeORMBookingRepository } from "./typeORM.booking.repository";

describe("TypeORMBookingRepository", () => {
	let dataSource: DataSource;
	let bookingRepository: TypeORMBookingRepository;
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
	});

	afterAll(async () => {
		await dataSource.destroy();
	});

	it("it should save a booking successfully", async () => {
		const propertyRepository = dataSource.getRepository(PropertyEntity);
		const userRepository = dataSource.getRepository(UserEntity);

		const propertyEntity = propertyRepository.create({
			id: "prop-1",
			title: "Cozy Cottage",
			description: "A cozy cottage in the countryside",
			maxGuests: 100,
			basePrice: 100,
		});
		await propertyRepository.save(propertyEntity);

		const property = new Property(
			"prop-1",
			"Cozy Cottage",
			"A cozy cottage in the countryside",
			100,
			100,
		);

		const userEntity = userRepository.create({
			id: "user-1",
			name: "John Doe",
		});
		await userRepository.save(userEntity);

		const user = new User("user-1", "John Doe");
		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-10"),
		);

		const booking = new Booking("1", property, user, dateRange, 4);

		await bookingRepository.save(booking);

		const savedBooking = await bookingRepository.findById("1");

		expect(savedBooking).not.toBeNull();
		expect(savedBooking?.getId()).toBe("1");
		expect(savedBooking?.getProperty().getId()).toBe("prop-1");
		expect(savedBooking?.getUser().getId()).toBe("user-1");
		expect(savedBooking?.getDateRange().getStartDate()).toEqual(
			new Date("2024-07-01"),
		);
		expect(savedBooking?.getDateRange().getEndDate()).toEqual(
			new Date("2024-07-10"),
		);
		expect(savedBooking?.getGuestCount()).toBe(4);
	});

	it("it should return null when booking is not found", async () => {
		const booking = await bookingRepository.findById("non-existent-id");
		expect(booking).toBeNull();
	});

	it("it should mark a booking as canceled", async () => {
		const propertyRepository = dataSource.getRepository(PropertyEntity);
		const userRepository = dataSource.getRepository(UserEntity);

		const propertyEntity = propertyRepository.create({
			id: "prop-1",
			title: "Cozy Cottage",
			description: "A cozy cottage in the countryside",
			maxGuests: 100,
			basePrice: 100,
		});
		await propertyRepository.save(propertyEntity);

		const property = new Property(
			"prop-1",
			"Cozy Cottage",
			"A cozy cottage in the countryside",
			100,
			100,
		);

		const userEntity = userRepository.create({
			id: "user-1",
			name: "John Doe",
		});
		await userRepository.save(userEntity);

		const user = new User("user-1", "John Doe");
		const dateRange = new DateRange(
			new Date("2024-07-01"),
			new Date("2024-07-10"),
		);

		const booking = new Booking("1", property, user, dateRange, 4);

		await bookingRepository.save(booking);

		booking.cancel(new Date("2024-06-25"));

		await bookingRepository.save(booking);

		const updatedBooking = await bookingRepository.findById("1");

		expect(updatedBooking).not.toBeNull();
		expect(updatedBooking?.getStatus()).toBe("cancelled");
	});
});
