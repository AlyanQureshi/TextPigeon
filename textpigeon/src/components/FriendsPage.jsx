import React, { useState } from 'react';
import { Sidebar } from './';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Cookies from 'universal-cookie';

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
                return <div>Current Friends Content</div>;
            case 'add':
                return <div>Add Friends Content</div>;
            case 'requests':
                return <div>Incoming Friend Requests Content</div>;
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
                  <Item
                    className='item'
                    onClick={() => setActiveTab("requests")}
                    sx={{ backgroundColor: activeTab === "requests" && "#0049b5" }}
                  >
                    Incoming Friend Requests
                  </Item>
                </Stack>
              </Box>
            </div>
          </div>
          <div className='friends-page__content'>
            {renderContent()}
          </div>
        </div>
      );
}

export default FriendsPage;