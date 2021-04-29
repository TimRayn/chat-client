import { HubConnection } from "@microsoft/signalr";
import React, { FormEvent, useEffect, useState, KeyboardEvent } from "react";
import { deleteMessageForAll, getAllMessagesByRoom, sendMessage } from "../../api/message.service";
import { Message } from "../../api/models/Message";
import { Room } from "../../api/models/Room";
import { User } from "../../api/models/User";
import { setUpSignalRConnection } from "../../api/notification.service";

export function useChat(room: Room, user: User) {
    const [messages, setMessages] = useState<Message[]>();
    const [messageText, setMessageText] = useState<string>();
    const [hubConnection, setHubConnection] = useState<HubConnection>();
    const [selectedMessages, setSelectedMesssages] = useState<Message[]>([]);


    function onMessageSent(message: Message) {
        setMessages((old) => old?.concat(message))
    }

    function onMessageDeleted(message: Message) {
        setMessages(old => old?.filter(x => x.id !== message.id));
    }

    function onEnterPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                setMessageText(old => old?.concat('\n'));
                return;
            }
            handleSend();
        }
    }

    function onSelected(message: Message) {
        console.log('1log ');
        console.log(selectedMessages);
        if (selectedMessages.includes(message)) {
            setSelectedMesssages(old => {
                old.splice(old.indexOf(message), 1);
                console.log('if');
                
                return old;
            })
        }
        else {
            setSelectedMesssages(old => {
                old.push(message);
                console.log('else');
                
                return old;
            });
        }
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

    useEffect(() => {
        if (hubConnection)
            hubConnection.on('MessageDeleted', onMessageDeleted);
    }, [hubConnection]);

    async function handleSend() {
        console.log(messageText)
        if (!messageText) return;
        await sendMessage({
            content: messageText,
            roomId: room.roomId,
            userId: user.id
        });
        setMessageText('');
    };

    function onMessageTextChange(text: string) {
        setMessageText(text);
    };

    function onDelete(id: string) {
        deleteMessageForAll(id);
    }

    return {
        messages,
        messageText,
        onMessageTextChange,
        handleSend,
        onDelete,
        onEnterPress,
        onSelected,
        countSelected: selectedMessages.length,
        selectedMessages
    }

}