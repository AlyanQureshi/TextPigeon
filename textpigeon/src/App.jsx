import React from 'react';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";

import { ChannelListContainer, ChannelContainer, Auth } from "./components";

import "./App.css"

const cookies = new Cookies();

const stream_apikey = process.env.REACT_APP_STREAM_API_KEY;

const client = StreamChat.getInstance(stream_apikey); 

const authToken = cookies.get("token");

if (authToken) {
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        hashedPassword: cookies.get('hashedPassword'),
    }, authToken)
}

const App = () => {
    if (!authToken) 
        return <Auth />

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
