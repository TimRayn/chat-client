export type CreateMessageDTO = {
    roomId: string;
    userId: string;
    content: string;
    repliedMessageContent: string;
}