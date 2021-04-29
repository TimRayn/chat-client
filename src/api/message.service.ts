import axios from "axios";
import { Message } from "./models/Message";
import { CreateMessageDTO } from "./models/CreateMessageDTO";

export async function getAllMessagesByRoom(roomId: string): Promise<Message[]> {
    const resp = await axios.get('message/getAllByRoom', { params: {roomId: roomId}});
    return resp.data;
} 

export async function sendMessage(message: CreateMessageDTO): Promise<Message> {
    const resp = await axios.post('message/create', { ...message });
    return resp.data;
}

export async function deleteMessageForAll(id:string) {
    const resp = await axios.delete('message/delete', {params: {messageId: id}})
    return resp.data;
}