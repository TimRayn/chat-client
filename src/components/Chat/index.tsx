import { FC } from 'react'
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
    const { messages, messageText, handleSend, onMessageTextChange, onDelete, onEnterPress, onSelected, selectedMessages, onEdit, isEditMod, getShortNick } = useChat(room, user);

    function buildMessage(message: Message, selectedMessages: Message[]) {
        const classFromOwner = message.userId === user.id ? ' from-owner' : '';
        const classSelected = selectedMessages.includes(message) ? ' selected' : '';

        return (
            <li
                key={message.id}
                className={`message-wrapper${classFromOwner}`} >
                <div className='nickname-span'>{getShortNick(room.users.find(x => x.id === message.userId)?.nickName || '')}</div>
                <p
                    className={`message${classSelected}`}
                    onClick={() => onSelected(message)}>
                    {message.content}
                </p>
            </li>)
    }

    const classMessSelected = selectedMessages.length > 0 ? ' mess-selected' : '';
    const isDisabled = selectedMessages.length !== 1;

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
                            className='send-area'
                            wrap='soft'
                            rows={1}
                            autoFocus
                            value={messageText}
                            onChange={(e) => onMessageTextChange(e.target.value)}
                            onKeyPress={(e) => onEnterPress(e)}>
                        </textarea>
                        <button className='send-btn' onClick={handleSend}></button>
                    </div>
                </div>
                <div className={`edit-panel${classMessSelected}`}>
                    <span className='selected-messages'>SELECTED: {selectedMessages.length}</span>
                    <button className='edit-btn' disabled={isDisabled} onClick={onEdit}>EDIT</button>
                    <button className='delete-btn' onClick={onDelete}>DELETE</button>
                    {isEditMod ? <span>EDITING</span> : null}
                </div>
            </div>
        </div>);
}

export default Chat;

