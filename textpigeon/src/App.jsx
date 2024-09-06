import React, { useState, useEffect } from 'react';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ChannelListContainer, ChannelContainer, Auth, FriendsPage } from "./components";

import 'stream-chat-react/dist/css/index.css';
import "./App.css";

const cookies = new Cookies();

const stream_apikey = process.env.REACT_APP_STREAM_API_KEY;
const client = StreamChat.getInstance(stream_apikey);

const App = () => {
    const [authToken, setAuthToken] = useState(cookies.get('token'));
    const [createType, setCreateType] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (authToken) {
            client.connectUser({
                id: cookies.get('userId'),
                name: cookies.get('username'),
                fullName: cookies.get('fullName'),
                hashedPassword: cookies.get('hashedPassword'),
            }, authToken);
        }
    }, [authToken]); 

    return (
        <Router>
            <Chat client={client} theme='team light'>
                <Routes>
                    {/* If the user is not authenticated, redirect to /auth */}
                    {!authToken ? (
                        <>
                            <Route path="/auth" element={<Auth setAuthToken={setAuthToken} />} />
                            <Route path="*" element={<Navigate to="/auth" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/home" element={
                                <div className='app__wrapper'>
                                    <ChannelListContainer
                                        isCreating={isCreating}
                                        setIsCreating={setIsCreating}
                                        setCreateType={setCreateType}
                                        setIsEditing={setIsEditing}
                                        setAuthToken={setAuthToken}
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
                            <Route path="/friends" element={<FriendsPage setAuthToken={setAuthToken} />} />
                            <Route path="/auth" element={<Navigate to="/home" />} /> 
                        </>
                    )}
                </Routes>
            </Chat>
        </Router>
    );
}

export default App;
