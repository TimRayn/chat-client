import React, { FC, useState } from "react";
import { User } from '../../api/models/User'

export type UserContextValue = {
    user?: User;
    updateUser: (user: User) => void;
}

export const UserContext = React.createContext<UserContextValue>({
    updateUser: () => {}
});

export const UserContextProvider: FC = ({children}) => {
    const [user, setUser] = useState<User>();

    const updateUser = (user: User) => {
        setUser(user);
    }
 
    return (
    <UserContext.Provider value={{user, updateUser}}>
        {children}
    </UserContext.Provider>)
}

