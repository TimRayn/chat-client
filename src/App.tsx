import axios from 'axios';
import React, { useState } from 'react';
import { User } from "./api/models/User";
import ChatPage from "./components/ChatPage";
import LoginPage from "./components/LoginPage";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
require('dotenv').config()

function App() {
  const [user, setUser] = useState<User>();

  return (
    user ? (<ChatPage user={user} />) : (<LoginPage onLogin={(user) => setUser(user)}/>)
  );
}

export default App;
