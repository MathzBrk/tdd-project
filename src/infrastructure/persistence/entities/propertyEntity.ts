import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BookingEntity } from "./bookingEntity";

@Entity("properties")
export class PropertyEntity {
	@PrimaryColumn("uuid")
	id!: string;

	@Column()
	title!: string;

	@Column()
	description!: string;

	@Column()
	maxGuests!: number;

	@Column({ type: "decimal" })
	basePrice!: number;

	@OneToMany(
		() => BookingEntity,
		(booking) => booking.property,
	)
	bookings!: BookingEntity[];
}
