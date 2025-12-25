import { Repository } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/bookingRepository";
import { BookingEntity } from "../persistence/entities/bookingEntity";
import { BookingMapper } from "../persistence/mappers/bookingMapper";

export class TypeORMBookingRepository implements BookingRepository {
	constructor(private ormRepository: Repository<BookingEntity>) {}

	async save(booking: Booking): Promise<void> {
		const bookingEntity = BookingMapper.toPersistence(booking);
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
		return BookingMapper.toDomain(bookingEntity);
	}
}
