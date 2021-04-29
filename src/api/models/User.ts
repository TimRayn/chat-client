import { Room } from './Room'

export type User = {
    id: string;
    nickName: string;
    rooms: Room[];
}