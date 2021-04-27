import React, { FC } from 'react'
import { Room } from '../../api/models/Room';

import './styles.scss';

export type SidePanelProps = {
    rooms: Room[];
}

const SidePanel: FC<SidePanelProps> = ({rooms}) => {
    return (
    <div>
        <ul className='room-list'>
            {rooms.map((room) => 
            <li key={room.roomId} className="room-button">
                {room.name}
            </li>)}
        </ul>
    </div>);
}

export default SidePanel;