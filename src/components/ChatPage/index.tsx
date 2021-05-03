import React, { FC, useState } from 'react';
import { User } from '../../api/models/User';
import SidePanel from '../SidePanel'
import Chat from '../Chat';

import './styles.scss';
import { Room } from '../../api/models/Room';
import { UserJoinedDTO } from '../../api/models/UserJoinedDTO';

export type ChatPageProps = {
    user: User;
};

const ChatPage: FC<ChatPageProps> = ({ user }) => {
    const [rooms, setRooms] = useState<Room[]>(user.rooms);
    const [selectedRoomId, setSelectedRoomId] = useState<string>("b7c83c21-09f2-46c2-9cb1-461aea2565d4");

    const selectedRoom = rooms.find((room) => room.roomId === selectedRoomId)!;

    const selectRoom = (roomId: string) => {
        setSelectedRoomId(roomId);
    }

    const onRoomCreated = (room: Room) => {
        setRooms((old) => old.concat(room));
        setSelectedRoomId(room.roomId);
    }

    const onUserJoined = (dto: UserJoinedDTO) => {
        console.log(dto);
        setRooms((old) => {
            const room = old.find((r) => r.roomId === dto.roomId);
            if (room)
                return old.filter((r) => r.roomId !== dto.roomId).concat({...room, users: room?.users.concat(dto.user)});
            return old;
        })
    }

    return (<div className='chat-page-root'>
        <div className="side-panel-container">
            <SidePanel rooms={rooms} user={user} selectRoom={selectRoom} selectedRoomId={selectedRoomId}/>
        </div>
        <div className="chat">
            <Chat room={selectedRoom} user={user} onRoomCreated={onRoomCreated} setSelectedRoomId={setSelectedRoomId} onUserJoined={onUserJoined} />
        </div>
    </div>);
};

export default ChatPage;