import { User } from "./User";

export type Room = {
    roomId: string;
    name: string;
    users: User[];
}