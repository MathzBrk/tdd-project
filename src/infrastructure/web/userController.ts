import type { NextFunction, Request, Response } from "express";
import type { CreateUserDTO } from "../../application/dtos/createUser.dto";
import type { UserService } from "../../application/services/userService";

export class UserController {
	constructor(private userService: UserService) {}

	async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { name }: CreateUserDTO = req.body;
			const user = await this.userService.saveUser({ name });
			res.status(201).json({
				message: "User created successfully",
				user: {
					id: user.getId(),
					name: user.getName(),
				},
			});
		} catch (error) {
			return res.status(400).json({
				message: (error as Error).message,
			});
		}
	}
}
