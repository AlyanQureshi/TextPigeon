import React, { useState } from 'react';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Cookies from 'universal-cookie';
import { useChatContext } from 'stream-chat-react';

const cookies = new Cookies();

const Sidebar = ({ setAuthToken }) => {
    const [open, setOpen] = useState(false);
    const { client } = useChatContext();

    const handleClose = () => {
        setOpen(false);
    }

    const logout = () => {
        cookies.remove("token");
        cookies.remove("userId");
        cookies.remove("username");
        cookies.remove("fullName");
        cookies.remove("hashedPassword");

        client.disconnectUser();

        setOpen(false);
        setAuthToken(null);
    }

    return (
        <>
            <div className="channel-list__sidebar">
                <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="channel-list__sidebar__icon1">
                        <div className="icon1__inner">
                            <QuestionAnswerIcon fontSize='large'/>
                        </div>
                    </div>
                </Link>
                <Link to="/friends" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="channel-list__sidebar__icon1">
                        <div className="icon1__inner"  >
                            <PeopleAltIcon fontSize='large'/> 
                        </div>
                    </div>
                </Link>
                <div className="channel-list__sidebar__icon2">
                    <div className="icon1__inner" onClick={() => setOpen(true)}>
                        <LogoutIcon fontSize='large'/>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Logout?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to logout from Text Pigeon?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={logout}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;
