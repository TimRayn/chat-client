import React, { FC } from 'react'
import { Room } from '../../api/models/Room';
import { User } from '../../api/models/User';

import './styles.scss';

export type SidePanelProps = {
    user: User;
    rooms: Room[];
    selectedRoomId: string;
    selectRoom: (roomId: string) => void;
}

const SidePanel: FC<SidePanelProps> = ({ user, rooms, selectedRoomId, selectRoom }) => {
    const publicId = "b7c83c21-09f2-46c2-9cb1-461aea2565d4";
    const roomItems = rooms.map((room) => room.roomId !== publicId ?
        <li
            key={room.roomId}
            className={`room-button${selectedRoomId === room.roomId ? " selected" : ""}`}
            onClick={() => selectRoom(room.roomId)}>
            {room.name || room.users.filter((x) => x.nickName !== user.nickName)[0].nickName}
        </li> : null);

    return (
        <div>
            <h3 className='header'>Hello, {user.nickName}</h3>
            <ul className='room-list'>
                <li
                    key={publicId}
                    className={`room-button public${selectedRoomId === publicId ? " selected" : ""}`}
                    onClick={() => selectRoom(publicId)}>
                    Public
                </li>
                <hr></hr>
                {roomItems}
            </ul>
        </div>);
}

export default SidePanel;