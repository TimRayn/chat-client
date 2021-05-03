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
    setSelectedRoomId: (roomId: string) => void;
}

const Chat: FC<ChatProps> = ({ room, user, onRoomCreated, onUserJoined, setSelectedRoomId }) => {
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
        createPrivateRoom,
        onReply,
        repliedMessage,
        onCancelReply } = useChat(room, user, onRoomCreated, onUserJoined, setSelectedRoomId);

    function buildMessage(message: Message, selectedMessages: Message[]) {
        console.log(message);
        if (message.isDeletedForOwner && message.userId === user.id) return;
        const classFromOwner = message.userId === user.id ? ' from-owner' : '';
        const classSelected = selectedMessages.includes(message) ? ' selected' : '';
        const nick = room?.users?.find(x => x.id === message.userId)?.nickName;


        return (
            <li
                key={message.id}
                className={`message-wrapper${classFromOwner}`} >
                <div
                    className='nickname-span'
                    data-name={nick}>
                    {nick}
                </div>
                <div
                    className={`message${classSelected}`}
                    onClick={() => !isEditMod && !locked ? onSelected(message) : null}>
                    <div className={`replied-message${message.repliedMessageContent ? ' show' : ''}`}>
                        <div className='line'></div>
                        {/* <span className='replied-user-name'>{repliedMessage}</span> */}
                        <span className='replied-content'>{message.repliedMessageContent}</span>

                    </div>
                    {message.content}
                </div>
            </li>)
    }

    const classMessSelected = selectedMessages.length > 0 ? ' mess-selected' : '';
    const isDisabledByCount = selectedMessages.length !== 1;
    const isDisabledByOwner = selectedMessages.some(x => x.userId !== user.id);
    const locked = Boolean(repliedMessage);

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
                <div className={`reply-panel${locked ? ' show' : ''}`}>
                    <span className='reply-span'>{repliedMessage}</span>
                    <button className='cancel-btn' onClick={onCancelReply}></button>
                </div>
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
                    <button
                        className='edit-btn'
                        disabled={isDisabledByCount || isDisabledByOwner || locked}
                        onClick={onEdit}>EDIT</button>
                    <button
                        className='delete-btn'
                        disabled={isDisabledByOwner || locked}
                        onClick={() => onDelete(false)}>DELETE FOR ALL</button>
                    <button
                        className='delete-for-one-btn'
                        disabled={isDisabledByOwner || locked}
                        onClick={() => onDelete(true)}>DELETE FOR ME</button>
                    {isEditMod ? <span>EDITING</span> : null}
                    <button
                        className='send-private-btn'
                        disabled={isDisabledByCount || !isDisabledByOwner || locked}
                        onClick={createPrivateRoom}>TO PRIVATE</button>
                    <button
                        className='reply-btn'
                        disabled={isDisabledByCount || locked}
                        onClick={onReply} >REPLY</button>
                </div>
            </div>
        </div >);
}

export default Chat;

// export type ModalProps = {
//     isShow: boolean
// }

// export const ReplyModal: FC<ModalProps> = ({isShow}) => {
//     return (<div className={`reply-modal${isShow ? ' show' : ''}`}>
//         <span>Choose room to reply.</span>
//     </div>)
// }