import { FC } from 'react'
import { Room } from '../../api/models/Room';
import { User } from '../../api/models/User';
import { useChat } from './useChat'
import './styles.scss';

export type ChatProps = {
    room: Room;
    user: User;
}

const Chat: FC<ChatProps> = ({ room, user }) => {
    const { messages, messageText, handleSend, onMessageTextChange } = useChat(room, user);

    return (
    <div className='chat-root'>
        <div className='chat-container'>
            <ul className='message-list'>
                {messages?.map((message) => (
                    <li
                        key={message.id}
                        className='message'>
                        {message.content}
                    </li>
                ))}
            </ul>
        </div>
        <div className='send-form-container'>
            <form
                className='send-form'
                onSubmit={handleSend}>
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => onMessageTextChange(e.target.value)} />
                <button type='submit'>Send</button>
            </form>
        </div>
    </div>);
}

export default Chat;

