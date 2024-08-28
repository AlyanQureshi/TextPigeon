import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
    const handleChange = (e) => {
        setChannelName(e.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Enter a Channel Name</p>
            <input value={channelName} onChange={handleChange} placeholder="Name (no-spaces)"/>
            <p>Add Members</p>
        </div>
    );
}

const CreateChannel = ({ createType, setIsCreating, setIntro, intro }) => {
    const [channelName, setChannelName] = useState('');
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
    const [error, setError] = useState('');

    const createChannel = async (e) => {
        e.preventDefault();

        // Clear any existing error before starting the channel creation process
        setError('');

        // Validation: Check if the channel name is empty
        if (createType === 'team' && channelName.trim() === '') {
            setError('Channel name is required');
            return;
        } 

        if (createType === 'team' && channelName.split(" ").length > 1) {
            setError("Channel name cannot have any spaces");
            return;
        }

        try {
            const newChannel = await client.channel(createType, channelName, {
                name: channelName, members: selectedUsers
            });

            await newChannel.watch();

            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);

            // Call the onChannelCreated callback to hide the intro page
            if (intro) {
                setIntro(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {createType === 'team' && (
                <>
                    <ChannelNameInput 
                        channelName={channelName} 
                        setChannelName={setChannelName} 
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                </>
            )}
            <UserList setSelectedUsers={setSelectedUsers} createType={createType} />
            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Create New Chat'}</p>
            </div>
        </div>
    );
}

export default CreateChannel;
