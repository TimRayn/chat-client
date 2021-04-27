import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { getAllMessagesByRoom, sendMessage } from "../../api/message.service";
import { Message } from "../../api/models/Message";
import { Room } from "../../api/models/Room";
import { User } from "../../api/models/User";
import { setUpSignalRConnection } from "../../api/notification.service";

export function useChat(room: Room, user: User) {
    const [messages, setMessages] = useState<Message[]>(); 
    const [messageText, setMessageText] = useState<string>();
    const [hubConnection, setHubConnection] = useState<HubConnection>();

    const onMessageSent = (message: Message) => {
        setMessages((old) => old?.concat(message))
    } 

    useEffect(() => {
        getAllMessagesByRoom(room.roomId).then((data) => setMessages(data));
    }, [room]);

    useEffect(() => {
        setUpSignalRConnection(user).then((connection) => setHubConnection(connection));
    }, [user]);

    useEffect(() => {
        if (hubConnection)
            hubConnection.on('MessageSent', onMessageSent);
    }, [hubConnection]);

    const handleSend = async () => {
        if (!messageText) return;
        await sendMessage({
            content: messageText, 
            roomId: room.roomId, 
            userId: user.id
        });
    };

    const onMessageTextChange = (text: string) => {
        setMessageText(text);
    };

    return {
        messages, 
        messageText, 
        onMessageTextChange,
        handleSend
    }
}