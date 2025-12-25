import type { Repository } from "typeorm";
import type { Booking } from "../../domain/entities/booking";
import type { BookingRepository } from "../../domain/repositories/bookingRepository";
import type { BookingEntity } from "../persistence/entities/bookingEntity";
import {
	bookingToDomain,
	bookingToPersistence,
} from "../persistence/mappers/bookingMapper";

export class TypeORMBookingRepository implements BookingRepository {
	constructor(private ormRepository: Repository<BookingEntity>) {}

	async save(booking: Booking): Promise<void> {
		const bookingEntity = bookingToPersistence(booking);
		await this.ormRepository.save(bookingEntity);
	}

	async findById(id: string): Promise<Booking | null> {
		const bookingEntity = await this.ormRepository.findOne({
			where: { id },
			relations: ["property", "guest"],
		});
		if (!bookingEntity) {
			return null;
		}
		return bookingToDomain(bookingEntity);
	}
}
