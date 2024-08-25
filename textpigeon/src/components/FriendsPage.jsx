import React, { useState, useEffect, useCallback } from 'react';
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
import { useChatContext } from 'stream-chat-react';

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

const FriendsPage = () => {
    const { client } = useChatContext();
    const [activeTab, setActiveTab] = useState('current');
    const [query, setQuery] = useState("");
    const [friendQuery, setFriendQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestPending, setRequestPending] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    // do backend for getting friend requests
    // show the users through map or some shit in table
    // do backend for accept logic, 
    // do backend for deny logic
    // do backend for unfriend logic
    // do backend for getting current friends and show it in the table of current friends by doing map or some shit
    // change the user list to only friends list by using the current friends function in the user list component
    // then make verification method
    // then host
    

    useEffect(() => {
        const getFriendRequests = async () => {
            const URL = "http://localhost:5000/friends/getFriendRequests";
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
            getFriendRequests();
        }
    }, [activeTab]);

    useEffect(() => {
        console.log('Updated friendRequests:', friendRequests);
    }, [friendRequests]);

    const handleBackdropClose = () => {
        setOpen(false);
      };

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    }

    const handleFriendQueryChange = (e) => {
        setFriendQuery(e.target.value);
    }

    const handleFriendRequest = async () => {
        setLoading(true);
        setRequestPending(true);

        const URL = "http://localhost:5000/friends/friendRequest";

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
            })
    
            setRequestMessage(message);
            setRequestPending(false); 
        } catch (error) {
            setRequestMessage(`${error.response?.data?.message}`);
            setRequestPending(false);
        }
        setFriendQuery("");
    }

    const handleAcceptClick = () => {
        setOpen(true);

        const URL = "http://localhost:5000/friends/acceptFriend";


    } 

    const handleDenyClick = () => {
        setOpen(true);

        const URL = "http://localhost:5000/friends/denyFriend";
    }

    const handleClose = () => {
        setLoading(false);
        setRequestMessage("");
        setRequestPending(false);
    }

    const logout = () => {
        cookies.remove("token");
        cookies.remove("userId");
        cookies.remove("username");
        cookies.remove("fullName");
        cookies.remove("hashedPassword");

        window.location.reload();
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
                            <input value={query} onChange={handleQueryChange} placeholder="Search for Friends" />
                            <p className='fw-bold '>Friends List</p>
                        </div> 
                        <div style={{ maxHeight: '610px', overflowY: 'auto', overflowX: 'hidden'}}>
                            <table className='table table-borderless table-hover'>
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Full Name</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Unfriend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>
                                            <IconButton aria-label="delete" color='error'>
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>
                                            <IconButton aria-label="delete" color='error'>
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td >Larry the Bird</td>
                                        <td>hello</td>
                                        <td>
                                            <IconButton aria-label="delete" color='error'>
                                                <DeleteIcon  />
                                            </IconButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
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
                            <p className='fw-bold '>Incoming Friend Requests</p>
                        </div>
                        {friendRequests.length === 0 ? (
                            <h5 style={{ margin: '20px' }}>You currently have no incoming friend requests.</h5>
                        ) : (
                            <div style={{ maxHeight: '610px', overflowY: 'auto', overflowX: 'hidden'}}>
                                <table className='table table-borderless table-hover'>
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Username</th>
                                            <th scope="col">Accept</th>
                                            <th scope="col">Deny</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>
                                                <IconButton aria-label="delete" color='success' onClick={handleAcceptClick}>
                                                    <CheckOutlinedIcon />
                                                </IconButton>
                                            </td>
                                            <td>
                                                <IconButton aria-label="delete" color='error' onClick={handleDenyClick}>
                                                    <CancelOutlinedIcon />
                                                </IconButton>
                                            </td>
                                        </tr>
                                        

                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Jacob</td>
                                            <td>Thornton</td>
                                            <td>
                                                <IconButton aria-label="delete" color='success'>
                                                    <CheckOutlinedIcon />
                                                </IconButton>
                                            </td>
                                            <td>
                                                <IconButton aria-label="delete" color='error'>
                                                    <CancelOutlinedIcon  />
                                                </IconButton>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">3</th>
                                            <td >Larry the Bird</td>
                                            <td>hello</td>
                                            <td>
                                                <IconButton aria-label="delete" color='success'>
                                                    <CheckOutlinedIcon />
                                                </IconButton>
                                            </td>
                                            <td>
                                                <IconButton aria-label="delete" color='error'>
                                                    <CancelOutlinedIcon  />
                                                </IconButton>
                                            </td>
                                        </tr>
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
            <Sidebar logout={logout}/>
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
        </div>
      );
}

export default FriendsPage;