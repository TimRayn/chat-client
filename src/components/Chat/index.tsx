import { FC, useState } from 'react'
import { Room } from '../../api/models/Room';
import { User } from '../../api/models/User';
import { useChat } from './useChat'
import './styles.scss';
import { Message } from '../../api/models/Message';

export type ChatProps = {
    room: Room;
    user: User;
}

const Chat: FC<ChatProps> = ({ room, user }) => {
    const { messages, messageText, handleSend, onMessageTextChange, onDelete, onEnterPress, onSelected, countSelected, selectedMessages } = useChat(room, user);

    function buildMessage(message: Message, selectedMessages: Message[]){
        const classFromOwner = message.userId === user.id ? ' from-owner' : '';
        const classSelected = selectedMessages.includes(message) ? ' selected' : '';

        return (
            <li
                onClick={() => onSelected(message)}
                key={message.id}
                className={`message-wrapper${classFromOwner}`} >
                <p className={`message${classSelected}`}>
                    <span>{room.users.find(x => x.id === message.userId)?.nickName}: </span>
                    {message.content}
                </p>
                {/* <div className='message-hud'>
                    <button className='delete-btn' onClick={() => onDelete(message.id)}>delete</button>
                    <button className='edit-btn'>edit</button>
                </div> */}
            </li>)
    }

    const classMessSelected = countSelected > 0 ? ' mess-selected' : '';

    return (
        <div className='chat-root'>
            <div className='chat-container'>
                <ul className='message-list'>
                    {messages?.sort((m1, m2) => Date.parse(m1.date) - Date.parse(m2.date)).map((message) => buildMessage(message, selectedMessages))}
                </ul>
            </div>
            <div className='bottom-panel'>
                <div className='send-form-container'>
                    <div className='send-form'>
                        <textarea
                            wrap='soft'
                            rows={1}
                            autoFocus
                            value={messageText}
                            onChange={(e) => onMessageTextChange(e.target.value)}
                            onKeyPress={(e) => onEnterPress(e)}>
                        </textarea>
                        <button onClick={handleSend}></button>
                    </div>
                </div>
                <div className={`edit-panel${classMessSelected}`}>
                    <span className='selected-messages'>SELECTED: {countSelected}</span>
                    <button className='edit-btn'>EDIT</button>
                    <button className='delete-btn'>DELETE</button>
                </div>
            </div>
        </div>);
}

export default Chat;

