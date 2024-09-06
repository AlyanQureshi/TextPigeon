import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { InviteIcon } from '../assets';

const cookies = new Cookies();

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers, createType, selectedUserId, setSelectedUserId }) => {
    const [selected, setSelected] = useState(false);
    const { client } = useChatContext();

    const handleMessageClick = () => {
        setSelectedUserId(user.id); // Set the selected user ID to the current user's ID
        setSelectedUsers([user.id, client.userID]);
    }

    const handleTeamClick= () => {
        if (selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }
        
        setSelected((prevSelected) => !prevSelected)
    }

    const isSelected = createType === "team" ? selected : selectedUserId === user.id;

    return (
        <div className="user-item__wrapper" onClick={createType === "team" ? handleTeamClick : handleMessageClick}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">
                    { (user.fullName || user.id).charAt(0).toUpperCase() + (user.fullName || user.id).slice(1) }
                </p>
            </div>
            {isSelected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    );
}

const UserList = ({ setSelectedUsers, createType }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            if (loading)
                return;
    
            setLoading(true);
            
            const URL =
                process.env.NODE_ENV === "production"
                ? "/api/friends/getFriends"
                : "http://localhost:5000/api/friends/getFriends";

            const username = cookies.get("username");
            try {
                const { data: { names_arr } } = await axios.post(URL, { username });

                if (names_arr.length === 0) {
                    setListEmpty(true);
                    return;
                }

                // Create an array to hold user metadata
                const usersMetadata = [];

                for (const name of names_arr) {
                    const response = await client.queryUsers({
                        name: name
                    });

                    // Push the user metadata to the array if users are found
                    if (response.users.length > 0) {
                        usersMetadata.push(response.users[0]); // Assuming names_arr contains unique names
                    }
                }   

                setUsers(usersMetadata);
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }
        
        if (client) 
            getUsers();
    }, []);

    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    There was an error loading your friends. Please refresh and try again!
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    You currently have no friends! Go to the Add Friends page and send a friend request.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading friends...
            </div> : (
                users?.map((user, i) => (
                    <UserItem 
                        index={i} 
                        key={user.id} 
                        user={user} 
                        setSelectedUsers={setSelectedUsers} 
                        createType={createType}
                        selectedUserId={selectedUserId}
                        setSelectedUserId={setSelectedUserId}
                    />  
                ))
            )}
        </ListContainer>
    );
}

export default UserList;
