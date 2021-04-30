import axios from "axios";
import { Message } from "./models/Message";
import { CreateMessageDTO } from "./models/CreateMessageDTO";

export async function getAllMessagesByRoom(roomId: string): Promise<Message[]> {
    const resp = await axios.get('message/getAllByRoom', { params: { roomId: roomId } });
    return resp.data;
}

export async function sendMessage(message: CreateMessageDTO): Promise<Message> {
    const resp = await axios.post('message/create', { ...message });
    return resp.data;
}

export async function deleteMessagesForAll(ids: string[]) {
    const resp = await axios.delete('message/delete', { data: [...ids] })
    return resp.data;
}

export async function updateMessage(message: Message) {
    const resp = await axios.put('message/update', { ...message });
    return resp.data;
}