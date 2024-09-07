import { React, useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ResultsDropdown } from './'
import { SearchIcon } from "../assets";
import axios from 'axios';

const cookies = new Cookies();

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);
    const [friendUsernames, setFriendUsernames] = useState([]);

    useEffect(() => {
        if(!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query])

    const fetchFriends = async () => {
        const URL =
            process.env.NODE_ENV === 'production'
                ? '/api/friends/getFriends'
                : 'http://localhost:5000/api/friends/getFriends';

        const username = cookies.get('username');

        try {
            const { data: { names_arr } } = await axios.post(URL, { username });
            setFriendUsernames(names_arr); // Set the friend usernames in state
        } catch (error) {
            console.error("Error fetching friends: ", error);
        }
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    const getChannels = async (text) => {
        setLoading(true);
        try {
            const channelResponse = client.queryChannels({
                type: 'team', 
                name: { $autocomplete: text }, 
                members: { $in: [client.userID]}
            });

            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }
            });

            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

            const filteredUsers = users.filter(user => 
                friendUsernames.some(friend => 
                    friend.toLowerCase() === user.name.toLowerCase() // Check if user exists in friendUsernames
                ) && user.name.toLowerCase().includes(text.toLowerCase()) // Match against the search query
            );           

            if(channels.length) 
                setTeamChannels(channels);

            if(filteredUsers.length) 
                setDirectChannels(filteredUsers);

        } catch (error) {
            setQuery('')
        } finally {
            setLoading(false);
        }
    }

    const onSearch = (e) => {
        e.preventDefault();
        setQuery(e.target.value);
        getChannels(e.target.value);
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon />
                </div>
                <input 
                    className="channel-search__input__text" 
                    placeholder="Search" 
                    type="text" 
                    value={query}  
                    onChange={onSearch}
                />
            </div>
            { query && (
                <ResultsDropdown 
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    );
}

export default ChannelSearch;
