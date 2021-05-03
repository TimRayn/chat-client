export type Message = {
    id: string;
    content: string;
    date: string;
    userId: string;
    roomId: string;
    isDeletedForOwner: boolean;
    repliedMessageContent: string;
}