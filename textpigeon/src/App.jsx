import React, { useState } from 'react';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ChannelListContainer, ChannelContainer, Auth, FriendsPage } from "./components";

import 'stream-chat-react/dist/css/index.css';
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
    const [createType, setCreateType] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    if (!authToken) 
        return <Auth />

    return (
        <Router>
            <Chat client={client} theme='team light'>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/home" element={
                        <div className='app__wrapper'>
                            <ChannelListContainer
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                setCreateType={setCreateType}
                                setIsEditing={setIsEditing}
                            />
                            <ChannelContainer
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                createType={createType}
                            />
                        </div>
                    } />
                </Routes>
            </Chat>
        </Router>
    );
}

export default App;
