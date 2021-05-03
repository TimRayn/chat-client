import React, { FC } from 'react'
import { useUser } from '../UserContext/useUser';
import ChatPage from "../ChatPage";
import LoginPage from "../LoginPage";

const AppContainer: FC = () => {
    const { user, updateUser } = useUser();

    return (user ? (<ChatPage user={user} />) : (<LoginPage onLogin={updateUser} />))
}

export default AppContainer;