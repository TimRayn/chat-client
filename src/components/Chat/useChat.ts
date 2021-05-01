import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState, KeyboardEvent, useCallback } from "react";
import { deleteMessagesForAll, getAllMessagesByRoom, sendMessage, updateMessage } from "../../api/message.service";
import { Message } from "../../api/models/Message";
import { Room } from "../../api/models/Room";
import { User } from "../../api/models/User";
import { setUpSignalRConnection } from "../../api/notification.service";

export function useChat(room: Room, user: User) {
    const [messages, setMessages] = useState<Message[]>();
    const [messageText, setMessageText] = useState<string>('');
    const [hubConnection, setHubConnection] = useState<HubConnection>();
    const [selectedMessages, setSelectedMesssages] = useState<Message[]>([]);
    const [isEditMod, setIsEditMod] = useState<boolean>(false);


    function onMessageSent(message: Message) {
        setMessages((old) => old?.concat(message))
    }

    function onMessagesDeleted(messages: Message[]) {
        setMessages(old => old?.filter(x => !messages.includes(x)));
    }

    const onMessageUpdated = useCallback((message: Message) => {
            const newMessages = messages?.filter(mess => mess.id !== message.id) || [];
            setMessages([...newMessages, message]); 
    }, [messages])

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
        if (selectedMessages.includes(message)) {
            const newMess = selectedMessages.filter(mess => mess !== message);
            setSelectedMesssages(newMess);
        }
        else {
            setSelectedMesssages([...selectedMessages, message]);
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
            hubConnection.on('MessagesDeleted', onMessagesDeleted);
    }, [hubConnection]);

    useEffect(() => {
        if (hubConnection)
            hubConnection.on('MessageUpdated', onMessageUpdated);
    }, [hubConnection, onMessageUpdated]);

    async function handleSend() {
        if (!messageText?.trim()) return;
        if (isEditMod) {
            editMessage();
            return;
        }
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

    async function onDelete() {
        const messagesIds = selectedMessages.map(item => item.id);
        await deleteMessagesForAll(messagesIds);
        setSelectedMesssages([]);
        setMessages(old => old?.filter(x => !messagesIds.includes(x.id)))
    }

    function onEdit() {
        setIsEditMod(old => !old);
        setMessageText(selectedMessages[0]?.content);
    }

    async function editMessage() {
        setIsEditMod(old => !old);
        const { date, roomId, userId, id } = selectedMessages[0];
        await updateMessage({
            content: messageText,
            date: date,
            roomId: roomId,
            userId: userId,
            id: id
        });
        setMessageText('');
        setSelectedMesssages([]);
    }

    function getShortNick(nickname: string) {
        const strArr = nickname?.split('');
        let result = strArr[0] || '';
        result.concat(strArr.find(x => x === x.toUpperCase()) || strArr.find(x => +x) || strArr[1] || '')
        return result;
    }

    return {
        messages,
        messageText,
        onMessageTextChange,
        handleSend,
        onDelete,
        onEnterPress,
        onSelected,
        selectedMessages,
        onEdit,
        isEditMod,
        getShortNick
    }

}