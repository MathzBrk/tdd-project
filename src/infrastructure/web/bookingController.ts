import { NextFunction, Request, Response } from "express";
import { CreateBookingDTO } from "../../application/dtos/createBooking.dto";
import { BookingService } from "../../application/services/bookingService";

export class BookingController {
	constructor(private bookingService: BookingService) {}

	async createBooking(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const { propertyId, userId, startDate, endDate, guestCount } = req.body;

			const start = new Date(startDate);
			const end = new Date(endDate);

			if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
				return res
					.status(400)
					.json({ message: "Start date or end date is invalid" });
			}

			const dto: CreateBookingDTO = {
				propertyId,
				guestId: userId,
				startDate: start,
				endDate: end,
				guestCount,
			};

			const booking = await this.bookingService.createBooking(dto);
			return res.status(201).json({
				message: "Booking created successfully",
				booking: {
					id: booking.getId(),
				},
			});
		} catch (error: any) {
			return res
				.status(400)
				.json({ message: error.message || "Error creating booking" });
		}
	}
	async cancelBooking(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const { id } = req.params;

			await this.bookingService.cancelBooking(id);

			return res.status(200).json({ message: "Booking canceled successfully" });
		} catch (error: any) {
			return res
				.status(400)
				.json({ message: error.message || "Error canceling booking" });
		}
	}
}
