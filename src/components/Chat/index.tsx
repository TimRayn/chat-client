import React, { FC } from 'react'
import { Room } from '../../api/models/Room';
import { User } from '../../api/models/User';
import { useChat } from './useChat'
import './styles.scss';
import { Message } from '../../api/models/Message';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserJoinedDTO } from '../../api/models/UserJoinedDTO';

export type ChatProps = {
    room: Room;
    user: User;
    onRoomCreated: (room: Room) => void;
    onUserJoined: (dto: UserJoinedDTO) => void;
}

const Chat: FC<ChatProps> = ({ room, user, onRoomCreated, onUserJoined }) => {
    const { 
        messages, 
        messageText, 
        handleSend, 
        onMessageTextChange, 
        onDelete, 
        onEnterPress, 
        hasMore, 
        onSelected, 
        selectedMessages, 
        onEdit, 
        isEditMod, 
        loadMessages, 
        createPrivateRoom } = useChat(room, user, onRoomCreated, onUserJoined);

    function buildMessage(message: Message, selectedMessages: Message[]) {
        const classFromOwner = message.userId === user.id ? ' from-owner' : '';
        const classSelected = selectedMessages.includes(message) ? ' selected' : '';

        return (
            <li
                key={message.id}
                className={`message-wrapper${classFromOwner}`} >
                <div
                    className='nickname-span'>
                    {room.users.find(x => x.id === message.userId)?.nickName}
                </div>
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
                <ul className='message-list'
                    id="scrollableDiv">
                    <InfiniteScroll
                        dataLength={messages?.length ?? 0}
                        next={loadMessages}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        inverse
                        hasMore={hasMore}
                        loader={""}
                        scrollableTarget="scrollableDiv"
                    >
                        {messages?.map((message) => buildMessage(message, selectedMessages))}
                    </InfiniteScroll>
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
                    <button className='send-private-btn' onClick={createPrivateRoom}>TO PRIVATE</button>
                </div>
            </div>
        </div >);
}

export default Chat;

