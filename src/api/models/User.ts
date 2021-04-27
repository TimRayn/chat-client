import { Room } from './Room'

export type User = {
    id: string;
    nickname: string;
    rooms: Room[];
}