import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PropertyEntity } from "./propertyEntity";
import { UserEntity } from "./userEntity";

@Entity("bookings")
export class BookingEntity {
	@PrimaryColumn("uuid")
	id!: string;

	@ManyToOne(
		() => PropertyEntity,
		(property) => property.bookings,
		{ nullable: false },
	)

	@JoinColumn({ name: "property_id" })
	property!: PropertyEntity;

	@ManyToOne(() => UserEntity, { nullable: false })
	@JoinColumn({ name: "guest_id" })
	guest!: UserEntity;

	@Column({ type: "datetime", name: "start_date" })
	startDate!: Date;

	@Column({ type: "datetime", name: "end_date" })
	endDate!: Date;

	@Column({ type: "int", name: "guest_count" })
	guestCount!: number;

	@Column({ type: "decimal", name: "total_price" })
	totalPrice!: number;

	@Column()
	status!: "confirmed" | "cancelled" | "completed";
}
