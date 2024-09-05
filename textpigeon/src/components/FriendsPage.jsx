import React, { useState, useEffect } from 'react';
import { Sidebar } from './';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Cookies from 'universal-cookie';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '@mui/material/Button';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useChatContext, Avatar } from 'stream-chat-react';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#005fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  marginTop: "10px",
  paddingLeft: "20px",
  textAlign: 'left',
  color: 'white',
}));

const cookies = new Cookies();

const FriendsHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Friends Page</p>
    </div>
);

// const personal_username = cookies.get("username");

const FriendsPage = () => {
    const { client } = useChatContext();
    const [activeTab, setActiveTab] = useState('current');
    const [query, setQuery] = useState("");
    const [friendQuery, setFriendQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestPending, setRequestPending] = useState(false);
    const [open, setOpen] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [currFriends, setCurrFriends] = useState([]);
    const [unfriendConfirmation, setConfirmation] = useState(false);
    const [unfriendedUsername, setUnfriendedUsername] = useState("");
    const [filteredFriends, setFilteredFriends] = useState([]);
    const personal_username = cookies.get("username");

    // do backend for getting friend requests // done
    // show the users through map or some shit in table // done
    // do backend for getting current friends and show it in the table of current friends by doing map or some shit // done
    // do backend for accept logic, // done
    // do backend for deny logic // done
    // do backend for unfriend logic // done
    // functionality for search in current friends // done
    // change the user list to only friends list by using the current friends function in the user list component // done
    // then make verification method
    // then host
    
    // Use Effect for getting Friend Requests
    useEffect(() => {
        const getFriendRequests = async () => {
            const URL =
                process.env.NODE_ENV === "production"
                ? "/friends/getFriendRequests"
                : "http://localhost:5000/friends/getFriendRequests";

            const username = cookies.get("username");
            try {
                const { data: { names_arr } } = await axios.post(URL, { username });
                if (names_arr.length !== 0) {
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
                    setFriendRequests(usersMetadata);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (activeTab === 'add') {
            setOpen(true);
            getFriendRequests();
            setOpen(false);
        }
    }, [activeTab]);

    // Use Effect for getting current friends
    useEffect(() => {
        const getFriends = async () => {
            const URL =
                process.env.NODE_ENV === "production"
                ? "/friends/getFriends"
                : "http://localhost:5000/friends/getFriends";

            const username = cookies.get("username");
            try {
                const { data: { names_arr } } = await axios.post(URL, { username });
                if (names_arr.length !== 0) {
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
                    setCurrFriends(usersMetadata);
                    setFilteredFriends(usersMetadata);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (activeTab === 'current') {
            setOpen(true);
            getFriends();
            setOpen(false);
        }
    }, [activeTab]);

    const handleBackdropClose = () => {
        setOpen(false);
    };

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
    
        if (newQuery.trim() === "") {
            // If the query is empty, show all friends
            setFilteredFriends(currFriends);
        } else {
            // Filter friends based on the query
            const filtered = currFriends.filter(friend => 
                friend.fullName.toLowerCase().includes(newQuery.toLowerCase()) ||
                friend.name.toLowerCase().includes(newQuery.toLowerCase())
            );
    
            setFilteredFriends(filtered);
        }
    };

    const handleFriendQueryChange = (e) => {
        setFriendQuery(e.target.value);
    }

    const handleFriendRequest = async () => {
        setLoading(true);
        setRequestPending(true);

        const URL =
                process.env.NODE_ENV === "production"
                ? "/friends/friendRequest"
                : "http://localhost:5000/friends/friendRequest";

        const sender_username = cookies.get("username");

        if (friendQuery === sender_username) {
            setRequestMessage("You can't friend request yourself, silly!");
            setRequestPending(false); 
            setFriendQuery("");
            return;
        }

        try {
            const { data: { message }} = await axios.post(URL, {
                receiver_username: friendQuery, sender_username
            });
    
            setRequestMessage(message);
            setRequestPending(false); 
        } catch (error) {
            setRequestMessage(`${error.response?.data?.message}`);
            setRequestPending(false);
        }
        setFriendQuery("");
    }

    const handleAcceptClick = async (username) => {
        setOpen(true);
        const client_username = cookies.get("username");
        
        const URL =
                process.env.NODE_ENV === "production"
                ? "/friends/acceptFriend"
                : "http://localhost:5000/friends/acceptFriend";

        try {
            const response = await axios.post(URL, {
                accepted_username: username, client_username
            });

            setFriendRequests(friendRequests.filter(friendRequest => friendRequest.name !== username));
        } catch (error) {
            console.log(error);
        }
        setOpen(false);
    }

    const handleDenyClick = async (username) => {
        setOpen(true);
        const client_username = cookies.get("username");

        const URL =
                process.env.NODE_ENV === "production"
                ? "/friends/denyFriend"
                : "http://localhost:5000/friends/denyFriend";

        try {
            const response = await axios.post(URL, {
                denied_username: username, client_username
            });

            setFriendRequests(friendRequests.filter(friendRequest => friendRequest.name !== username));
        } catch (error) {
            console.log(error);
        }
        setOpen(false);
    }

    const handleUnfriendClick = async (username) => {
        setConfirmation(false);
        setOpen(true);
        const client_username = cookies.get("username");

        const URL =
                process.env.NODE_ENV === "production"
                ? "/friends/unfriend"
                : "http://localhost:5000/friends/unfriend";

        try {
            const response = await axios.post(URL, {
                unfriend_username: username, client_username
            });

            setCurrFriends(currFriends.filter(currFriend => currFriend.name !== username));
            setFilteredFriends(currFriends);
        } catch (error) {
            console.log(error);
        }
        setOpen(false);
    }

    const handleClose = () => {
        setLoading(false);
        setRequestMessage("");
        setRequestPending(false);
    }

    const handleConfirmationOpen = (username) => {
        setUnfriendedUsername(username);
        setConfirmation(true);
    }

    const handleConfirmationClose = () => {
        setConfirmation(false);
        setUnfriendedUsername("");
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'current':
                return (
                    <div className="edit-channel__container">
                        <div className="edit-channel__header">
                            <p>Current Friends</p>
                        </div>
                        <div className="channel-name-input__wrapper">
                            <p>Enter a Username</p>
                            <input 
                                value={query} 
                                onChange={handleQueryChange} 
                                placeholder="Search for Friends" 
                            />
                            <p className='fw-bold '>Friends List</p>
                        </div>
                        
                        {currFriends.length === 0 ? (
                            <h5 style={{ margin: '20px' }}>
                                You currently have no friends. Go to the Add Friends page and send a friend request!
                            </h5>
                        ) : filteredFriends.length === 0 ? (
                            <h5 style={{ margin: '20px' }}>
                                No friends match your search.
                            </h5>
                        ) : (
                            <div style={{ maxHeight: '610px', overflowY: 'auto', overflowX: 'hidden'}}>
                                <table className='table table-borderless table-hover'>
                                    <thead>
                                        <tr>
                                            <th scope="col">Profile Picture</th>
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Username</th>
                                            <th scope="col">Unfriend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFriends.map((friend, index) => (
                                            <tr key={index}>
                                                <th scope="row">
                                                    <Avatar image={friend.image} size={30} name={friend.name} shape='rounded'/>
                                                </th>
                                                <td>{(friend.fullName).charAt(0).toUpperCase() + (friend.fullName).slice(1)}</td>
                                                <td>{friend.name}</td>
                                                <td>
                                                    <IconButton aria-label="delete" color='error' 
                                                        onClick={() => handleConfirmationOpen(friend.name)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'add':
                return (
                    <div className="edit-channel__container">
                        <div className="edit-channel__header">
                            <p>Add Friends</p>
                        </div>
                        <div className="channel-name-input__wrapper">
                            <p>Send a Friend Request</p>
                            <div > 
                                <input value={friendQuery} onChange={handleFriendQueryChange} 
                                placeholder="Enter a Username" className='input_near_button' 
                                style={{ height: "40px" }}
                                />
                                <Button variant="contained" 
                                color='primary' 
                                disabled={friendQuery === ""}
                                className='input_with_button'  
                                onClick={handleFriendRequest}
                                >
                                    Send
                                </Button>
                            </div>
                            <p className='fw-bold '>Incoming Friend Requests. (Your personal username: {personal_username})</p>
                        </div>
                        {friendRequests.length === 0 ? (
                            <h5 style={{ margin: '20px' }}>
                                You currently have no incoming friend requests. Alternatively, send a friend request by entering a username above.
                            </h5>
                        ) : (
                            <div style={{ maxHeight: '610px', overflowY: 'auto', overflowX: 'hidden'}}>
                                <table className='table table-borderless table-hover'>
                                    <thead>
                                        <tr>
                                            <th scope="col">Profile Picture</th>
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Username</th>
                                            <th scope="col">Accept</th>
                                            <th scope="col">Deny</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {friendRequests.map((friendRequest, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope='row'>
                                                        <Avatar image={friendRequest.image} size={30} name={friendRequest.name} shape='rounded'/>
                                                    </th>
                                                    <td>{(friendRequest.fullName).charAt(0).toUpperCase() + (friendRequest.fullName).slice(1)}</td>
                                                    <td>{friendRequest.name}</td>
                                                    <td>
                                                        <IconButton aria-label="delete" color='success' 
                                                            onClick={() => handleAcceptClick(friendRequest.name)}
                                                        >
                                                            <CheckOutlinedIcon />
                                                        </IconButton>
                                                    </td>
                                                    <td>
                                                        <IconButton aria-label="delete" color='error' 
                                                            onClick={() => handleDenyClick(friendRequest.name)}
                                                            >
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='channel-list__container'>
            <Sidebar />
            <div className='channel-list__list__wrapper'>
                <FriendsHeader />
                <div className='channel-list__list__items'>
                    <Box sx={{ width: '85%' }}>
                        <Stack spacing={2}>
                            <Item
                                className='item'
                                onClick={() => setActiveTab("current")}
                                sx={{ backgroundColor: activeTab === "current" && "#0049b5"}}
                            >
                                Current Friends
                            </Item>
                            <Item
                                className='item'
                                onClick={() => setActiveTab("add")}
                                sx={{ backgroundColor: activeTab === "add" && "#0049b5"}}
                            >
                                Add Friends
                            </Item>
                        </Stack>
                    </Box>
                </div>
            </div>
            <div className='friends-page__content'>
                {renderContent()}
            </div>
            <Dialog
                open={loading}
                // onClose={handleClose} // comment this later
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {requestPending ? "Friend Request Pending." : "Friend Request"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {requestPending ? "Your friend request is pending..." : requestMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus disabled={requestPending}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleBackdropClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* below is confirmation for unfriending a username */}
            <Dialog
                open={unfriendConfirmation}
                onClose={handleConfirmationClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Unfriend?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to unfriend <span style={{ fontWeight: 'bold' }}>{unfriendedUsername}</span>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationClose}>No</Button>
                    <Button onClick={() => handleUnfriendClick(unfriendedUsername)}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
      );
}

export default FriendsPage;