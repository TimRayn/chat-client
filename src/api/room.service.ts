import axios from "axios";

export async function createRoom(userIds: string[]) {
    const resp = await axios.post('room/create', { userIds });
    return resp.data;
}