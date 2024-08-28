import React, { useState, useEffect } from 'react';
import { Channel, useChatContext } from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel } from './';



const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
    const { client } = useChatContext();
    const [intro, setIntro] = useState(true);
    const [open, setOpen] = useState(true); 

    useEffect(() => {
        const checkExistingChannels = async () => {
            const sort = [{ last_message_at: -1 }];

            // Adjusting the filter to check if the user is part of any channels
            const filter = { members: { $in: [client.userID] } };
            
            try {
                const channels = await client.queryChannels(filter, sort, {
                    state: false,
                    watch: false
                });

                if (channels.length > 0) {
                    setIntro(false);
                }

            } catch (error) {
                console.error("Error querying channels:", error);
            } finally {
                setOpen(false); 
            }
        };
    
        checkExistingChannels();
    }, [client]);

    if (isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel 
                    createType={createType} 
                    setIsCreating={setIsCreating} 
                    setIntro={setIntro} 
                    intro={intro}
                />
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="channel__container">
                <EditChannel setIsEditing={setIsEditing} />
            </div>
        );
    }

    if (open) {
        return <div>Loading...</div>; // Optionally show a loading indicator
    }

    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history.</p>
            <p className="channel-empty__second">Send messages, attachments, links, and more!</p>
        </div>
    )

	return (
	    <div className=" channel__container">
            {intro && (
                <>
                    <h4 className='display-3' style={{ margin: '20px' }}>Welcome To Text Pigeon!</h4>
                    <p className='fs-4' style={{ margin: '20px' }}>
                        Currently, you have no chats so click on the Friend's Icon on the left and 
                        send a friend request!
                    </p>
                </>
            )}  
			<Channel
                EmptyStateIndicator={EmptyState}
            >
                <ChannelInner setIsEditing={setIsEditing} />
            </Channel>
		</div>
	);
}

export default ChannelContainer;
