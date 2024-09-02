import { IUser } from "@/app/models";

export interface Thread {
	_id: string;
	title: string;
	message: string;
	timestamp: string;
	creatorId: IUser;
}
