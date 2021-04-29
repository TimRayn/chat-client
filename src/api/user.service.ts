import axios from "axios";
import { User } from "./models/User";

export async function login(nickname: string): Promise<User> {
    const resp = await axios.post('user/login', {nickname});
    return resp.data;
} 

export async function getAllUsersByRoom(roomId: string): Promise<User[]> {
    const resp = await axios.get('user/getAllByRoom', { params: {roomId: roomId}});
    return resp.data;
}