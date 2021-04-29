import React, { FC, useEffect, useState } from 'react';
import { User } from '../../api/models/User';
import SidePanel from '../SidePanel'
import Chat from '../Chat';

import './styles.scss';
import { Room } from '../../api/models/Room';

export type ChatPageProps = {
    user: User
};

const ChatPage: FC<ChatPageProps> = ({ user }) => {
    const [rooms, setRooms] = useState<Room[]>(user.rooms);
    const [selectedRoomId, setSelectedRoomId] = useState<string>(user.rooms[0].roomId);

    const selectedRoom = rooms.find((room) => room.roomId === selectedRoomId)!;

    return (<div className='chat-page-root'>
        <div className="side-panel-container">
            <SidePanel rooms={user.rooms} />
        </div>
        <div className="chat">
            <Chat room={selectedRoom} user={user} />
        </div>
    </div>);
};

export default ChatPage;