import React, { useState } from 'react';
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
    const [activeTab, setActiveTab] = useState('current');
    const [query, setQuery] = useState("");
    const [friendQuery, setFriendQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestPending, setRequestPending] = useState(false);

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    }

    const handleFriendQueryChange = (e) => {
        setFriendQuery(e.target.value);
    }

    const handleFriendRequest = async (e) => {
        setLoading(true);
        setRequestPending(true);

        const URL = "http://localhost:5000/friends/friendRequest";

        const sender_username = cookies.get("username");

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
                        <div style={{ maxHeight: '640px', overflowY: 'auto', overflowX: 'hidden'}}>
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
                        <div style={{ maxHeight: '640px', overflowY: 'auto', overflowX: 'hidden'}}>
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
                                            <IconButton aria-label="delete" color='success'>
                                                <CheckOutlinedIcon />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <IconButton aria-label="delete" color='error'>
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
        </div>
      );
}

export default FriendsPage;