import React, { FC, useEffect, useRef } from 'react'
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

    const scrollRef = useRef<HTMLUListElement>(null);

    function buildMessage(message: Message, selectedMessages: Message[]) {
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

    useEffect(() => {
        return () => {
            if (scrollRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                const hasScroll = scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
                if (!hasScroll && hasMore && messages.length > 0) {
                    loadMessages();
                }
            }
        }
    }, [scrollRef, hasMore, loadMessages, messages])

    return (
        <div className='chat-root'>
            <div className='chat-container'>
                <ul className='message-list'
                    id="scrollableDiv" ref={scrollRef}>
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
                    <div className='span-container'>
                        <span className='selected-messages'>SELECTED: {selectedMessages.length}</span>
                    </div>
                    {isEditMod ? <div className='span-container'><span>EDITING</span></div> : null}
                    <button
                        className={`${isDisabledByCount || isDisabledByOwner || locked ? 'disabled' : 'active'}`}
                        disabled={isDisabledByCount || isDisabledByOwner || locked}
                        onClick={onEdit}>EDIT</button>
                    <button
                        className={`${isDisabledByOwner || locked || isEditMod ? 'disabled' : 'active'}`}
                        disabled={isDisabledByOwner || locked || isEditMod}
                        onClick={() => onDelete(false)}>DELETE FOR ALL</button>
                    <button
                        className={`${isDisabledByOwner || locked || isEditMod ? 'disabled' : 'active'}`}
                        disabled={isDisabledByOwner || locked || isEditMod}
                        onClick={() => onDelete(true)}>DELETE FOR ME</button>
                    <button
                        className={`${isDisabledByCount || !isDisabledByOwner || locked ? 'disabled' : 'active'}`}
                        disabled={isDisabledByCount || !isDisabledByOwner || locked}
                        onClick={createPrivateRoom}>TO PRIVATE</button>
                    <button
                        className={`${isDisabledByCount || locked || isEditMod ? 'disabled' : 'active'}`}
                        disabled={isDisabledByCount || locked || isEditMod}
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