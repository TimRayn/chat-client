import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState, KeyboardEvent, useCallback } from "react";
import { deleteMessages, getMessages, sendMessage, updateMessage } from "../../api/message.service";
import { createRoom } from "../../api/room.service"
import { Message } from "../../api/models/Message";
import { Room } from "../../api/models/Room";
import { User } from "../../api/models/User";
import { UserJoinedDTO } from "../../api/models/UserJoinedDTO"
import { setUpSignalRConnection } from "../../api/notification.service";

export function useChat(
    room: Room,
    user: User,
    onRoomCreated: (room: Room) => void,
    onUserJoined: (dto: UserJoinedDTO) => void,
    setSelectedRoomId: (roomId: string) => void) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>('');
    const [hubConnection, setHubConnection] = useState<HubConnection>();
    const [selectedMessages, setSelectedMesssages] = useState<Message[]>([]);
    const [isEditMod, setIsEditMod] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [repliedMessage, setRepliedMessage] = useState<string>('');

    function onReply() {
        setRepliedMessage(selectedMessages[0].content);
        setSelectedMesssages([]);
    }

    function onMessageSent(message: Message) {
        setMessages((old) => {
            const newMessages = [...old];
            newMessages.unshift(message);
            return newMessages;
        })
    }


    function onMessagesDeleted(messages: Message[]) {
        setMessages(old => old?.filter(x => !messages.includes(x)));
    }

    const onMessageUpdated = (message: Message) => {
        setMessages((old) => [...old?.filter(mess => mess.id !== message.id), message]);
    };

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
        setUpSignalRConnection(user).then((connection) => setHubConnection(connection));
    }, [user]);

    const handleRoomCreated = useCallback((room: Room) => {
        console.log('room created');
        onRoomCreated(room);
        if (hubConnection)
            hubConnection.invoke('RegisterMessageListeningForRoom', room.roomId);
    }, [hubConnection, onRoomCreated])

    useEffect(() => {
        if (hubConnection) {
            console.log('Subscribe');
            hubConnection.on('MessageSent', onMessageSent);
            hubConnection.on('MessagesDeleted', onMessagesDeleted);
            hubConnection.on('MessageUpdated', onMessageUpdated);
            hubConnection.on('RoomCreated', handleRoomCreated);
            hubConnection.on('UserJoined', onUserJoined)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hubConnection]);

    async function handleSend() {
        if (!messageText?.trim()) return;
        if (isEditMod) {
            editMessage();
            return;
        }
        await sendMessage({
            content: messageText,
            roomId: room.roomId,
            userId: user.id,
            repliedMessageContent: repliedMessage
        });
        setRepliedMessage('');
        setMessageText('');
    };

    function onMessageTextChange(text: string) {
        setMessageText(text);
    };

    async function onDelete(forOne: boolean) {
        const messagesIds = selectedMessages.map(item => item.id);
        await deleteMessages(messagesIds, forOne);
        setSelectedMesssages([]);
        setMessages(old => old?.filter(x => !messagesIds.includes(x.id)))
    }

    function onEdit() {
        setIsEditMod(old => !old);
        setMessageText(selectedMessages[0]?.content);
    }

    async function editMessage() {
        setIsEditMod(old => !old);
        const { date, roomId, userId, id, isDeletedForOwner } = selectedMessages[0];
        await updateMessage({
            content: messageText,
            date: date,
            roomId: roomId,
            userId: userId,
            id: id,
            isDeletedForOwner: isDeletedForOwner,
            repliedMessageContent: ""
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

    function updateMessages(messages: Message[], replace: boolean) {
        setMessages((old) => replace ? messages : old.concat(messages));
        if (messages.length < 20) setHasMore(false);
    }

    async function loadMessages() {
        const from = messages && messages.length > 0 ? messages[messages.length - 1].date : new Date().toISOString();
        const data = await getMessages(room.roomId, from, 20);
        updateMessages(data, false);
    }

    useEffect(() => {
        getMessages(room.roomId, new Date().toISOString(), 20).then((data) => {
            updateMessages(data, true);
            setHasMore(true);
            setSelectedMesssages([]);
        });
    }, [room])

    async function createPrivateRoom() {
        const message = selectedMessages[0];
        const ExistingRoomId = user.rooms.find(room => room.users[0].id === message.userId)?.roomId;
        if (ExistingRoomId) setSelectedRoomId(ExistingRoomId);
        else await createRoom([user.id, message.userId]);
    }

    function onCancelReply() {
        setRepliedMessage('');
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
        getShortNick,
        loadMessages,
        hasMore,
        createPrivateRoom,
        onReply,
        repliedMessage,
        onCancelReply
    }

}