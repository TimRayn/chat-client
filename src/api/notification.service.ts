import * as signalR from "@microsoft/signalr";
import { User } from "./models/User";

export const setUpSignalRConnection = async (user: User): Promise<signalR.HubConnection> => {
    const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_WEB_SOCKET}/message`).withAutomaticReconnect().build();

    await connection.start();
    connection.invoke('RegisterMessageListening', user.rooms.map((room) => room.roomId))

    return connection;
}