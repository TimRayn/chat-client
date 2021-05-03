import axios from 'axios';
import React from 'react';
import AppContainer from "./components/AppContainer";
import { UserContextProvider } from "./components/UserContext"

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
require('dotenv').config()

function App() {
  return (
    <UserContextProvider>
      <AppContainer />
    </UserContextProvider>

  );
}

export default App;
