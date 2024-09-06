import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';

import { ChannelSearch, TeamChannelList, TeamChannelPreview, Sidebar } from './';

const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Text Pigeon</p>
    </div>
);

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
}

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
}

const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer, setAuthToken }) => {
    const { client } = useChatContext();

    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            <Sidebar setAuthToken={setAuthToken} />
            <div className="channel-list__list__wrapper">
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer}/>
                <ChannelList 
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter}
                    List={(props) => (
                        <TeamChannelList 
                            {...props}
                            type="team"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(props) => (
                        <TeamChannelPreview 
                            {...props}
                            type="team"
                            setToggleContainer={setToggleContainer}
                            setIsEditing={setIsEditing}
                            setIsCreating={setIsCreating}
                        />
                    )}  
                />
                <ChannelList 
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(props) => (
                        <TeamChannelList
                            {...props}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(props) => (
                        <TeamChannelPreview 
                            {...props}
                            type="messaging"
                            setToggleContainer={setToggleContainer}
                            setIsEditing={setIsEditing}
                            setIsCreating={setIsCreating}
                        />
                    )}  
                />
            </div>
        </>
    );
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing, setAuthToken }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            <div className="channel-list__container">
              <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing}
                setAuthToken={setAuthToken} 
              />
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff"}}
            >
                <div className="channel-list__container-toggle" onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent 
                    setIsCreating={setIsCreating} 
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                    setAuthToken={setAuthToken}
                />
            </div>
        </>
    );
}

export default ChannelListContainer;
