import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import axios from 'axios';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
    
    const handleChange = (e) => {
        setChannelName(e.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="Channel Name" />
            <p>Add Friends to Channel</p>
        </div>
    );
}

const EditChannel = ({ setIsEditing }) => {
    const { channel, client } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [selectedUsers, setSelectedUsers] = useState([])
    
    const grantAdmin = async (userId) => {
        const URL =
                process.env.NODE_ENV === "production"
                ? "/admin/grant"
                : "http://localhost:5000/admin/grant";

        try {
            const response = await axios.post(URL, {
                userId
            });
    
            if (!response.ok) {
                throw new Error('Failed to grant admin permissions');
            }
        } catch (error) {
            console.log('Error granting admin permissions:', error);
        }
    };

    const revokeAdmin = async (userId) => {
        const URL =
                process.env.NODE_ENV === "production"
                ? "/admin/revoke"
                : "http://localhost:5000/admin/revoke";

        try {
            const response = await axios.post(URL, {
                userId
            });
    
            if (!response.ok) {
                throw new Error('Failed to revoke admin permissions');
            }
        } catch (error) {
            console.log('Error revoking admin permissions:', error);
        }
    };

    const updateChannel = async (event) => {
        event.preventDefault();
        
        grantAdmin(client.userID);

        const nameChanged = channelName !== (channel.data.name || channel.data.id);

        if(nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}`});
        }

        if(selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setIsEditing(false);
        setSelectedUsers([]);

        revokeAdmin(client.userID);
    }

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />

            <UserList setSelectedUsers={setSelectedUsers} />
            
            <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    );
}

export default EditChannel;
