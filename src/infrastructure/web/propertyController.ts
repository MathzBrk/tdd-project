import type { NextFunction, Request, Response } from "express";
import type { CreatePropertyDTO } from "../../application/dtos/createProperty.dto";
import type { PropertyService } from "../../application/services/propertyService";

export class PropertyController {
	constructor(private propertyService: PropertyService) {}
	async createProperty(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const {
				title,
				description,
				pricePerNight,
				maxGuests,
			}: CreatePropertyDTO = req.body;

			const property = await this.propertyService.saveProperty({
				title,
				description,
				pricePerNight,
				maxGuests,
			});

			return res.status(201).json({
				message: "Property created successfully",
				property: {
					id: property.getId(),
					title: property.getTitle(),
					description: property.getDescription(),
					pricePerNight: property.getBasePricePerNight(),
					maxGuests: property.getMaxGuests(),
				},
			});
		} catch (error) {
			return res.status(400).json({
				message: (error as Error).message,
			});
		}
	}
}
