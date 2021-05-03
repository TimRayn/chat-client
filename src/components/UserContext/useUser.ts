import React from "react";
import { UserContext } from ".";

export function useUser() {
    return React.useContext(UserContext);
}