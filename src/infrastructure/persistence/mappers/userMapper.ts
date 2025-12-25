import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entities/userEntity";

export const userToDomain = (userEntity: UserEntity): User => {
	return new User(userEntity.id, userEntity.name);
};

export const userToPersistence = (user: User): UserEntity => {
	const userEntity = new UserEntity();
	userEntity.id = user.getId();
	userEntity.name = user.getName();
	return userEntity;
};
