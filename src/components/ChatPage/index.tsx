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
    const [selectedRoomId, setSelectedRoom] = useState<string>(user.rooms[0].roomId);

    const selectedRoom = rooms.find((room) => room.roomId === selectedRoomId)!;

    const selectRoom = (roomId: string) => {
        setSelectedRoom(roomId);
    }

    const onRoomCreated = (room: Room) => {
        setRooms((old) => old.concat(room))
    }

    const onUserJoined = (dto: UserJoinedDTO) => {
        console.log(dto);
        setRooms((old) => {
            const room = old.find((r) => r.roomId === dto.roomId);
            console.log(room);
            if (room)
                return old.filter((r) => r.roomId !== dto.roomId).concat({...room, users: room?.users.concat(dto.user)});
            return old;
        })
    }

    return (<div className='chat-page-root'>
        <div className="side-panel-container">
            <SidePanel rooms={rooms} selectRoom={selectRoom} />
        </div>
        <div className="chat">
            <Chat room={selectedRoom} user={user} onRoomCreated={onRoomCreated} onUserJoined={onUserJoined} />
        </div>
    </div>);
};

export default ChatPage;