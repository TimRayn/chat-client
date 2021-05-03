import React, { FC } from 'react'
import { Room } from '../../api/models/Room';

import './styles.scss';

export type SidePanelProps = {
    rooms: Room[];
    selectRoom: (roomId: string) => void;
}

const SidePanel: FC<SidePanelProps> = ({rooms, selectRoom}) => {
    return (
    <div>
        <ul className='room-list'>
            {rooms.map((room) => 
            <li key={room.roomId} className="room-button" onClick={() => selectRoom(room.roomId)}>
                {room.name || room.users.map((x) => x.nickName).join(' ')}
            </li>)}
        </ul>
    </div>);
}

export default SidePanel;