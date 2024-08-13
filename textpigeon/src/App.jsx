import React from 'react';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { Cookies } from "universal-cookie";

import { ChannelListContainer, ChannelContainer, Auth } from "./components";

import "./App.css"

const stream_apikey = process.env.REACT_APP_STREAM_API_KEY;
const client = StreamChat.getInstance(stream_apikey); 

const isLoggedIn = false

const App = () => {
    if (!isLoggedIn) return <Auth />

    return (
        <div className='app__wrapper'>
        <Chat client={client} theme='team light'>
            <ChannelListContainer
            
            />
            <ChannelContainer
            
            />
        </Chat>
        </div>
    )
}

export default App;
