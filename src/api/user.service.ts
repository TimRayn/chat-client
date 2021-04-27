import axios from "axios";
import { User } from "./models/User";

export async function login(nickname: string): Promise<User> {
    const resp = await axios.post('user/login', {nickname});
    return resp.data;
} 