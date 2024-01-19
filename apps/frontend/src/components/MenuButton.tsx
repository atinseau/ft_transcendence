"use client"

import { useState } from 'react'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, IconTypeMap } from '@mui/material';
import { useRouter } from 'next/navigation';

import { FaGamepad, FaUser, FaUsers, FaComments, FaPowerOff, FaTrophy, FaHamburger } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import useAuthContext from '@contexts/AuthContext/useAuthContext';
import useUserContext from '@contexts/UserContext/useUserContext';
import socket from '@utils/socket';
import formatUserName from '@utils/formatUserName';


// TODO : verif statut login ou logout !!!


interface menuItemData {
  name: string,
  navigate: () => void,
  disabled?: boolean,
  icon: typeof FaGamepad
}

export default function MenuButton() {
  const [connected, setConnected] = useState(true);
  const [state, setState] = useState(false);

  const logout = useAuthContext((state) => state.logout)
  const isLogged = useAuthContext((state) => state.isLogged)
  const profile = useUserContext((state) => state.profile);

  const router = useRouter();
  const menuItems: { disconnected: menuItemData[], connected: menuItemData[] } = {
    connected: [
      { name: 'Play', navigate: () => router.push("/play"), icon: FaGamepad },
      { name: 'Profile', navigate: () => router.push("/profile/" + formatUserName(profile?.username)), icon: FaUser },
      { name: 'Friends', navigate: () => router.push("/friends"), icon: FaUsers },
      { name: 'Chat', navigate: () => router.push("/chat"), icon: FaComments },
      { name: 'Leaderboard', navigate: () => router.push("/leaderboard"), icon: FaTrophy },
      { name: 'Menu', navigate: () => router.push("/"), icon: FaHamburger },
      ...isLogged ? [
        {
          name: 'Logout',
          navigate: () => {
			if (profile)
				socket.emit('setStatus', { userId: profile.id, status: "offline" });
            logout()
            router.push('/')
          }, disabled: false, icon: FaPowerOff
        }
      ] : []
    ],

    //
    disconnected: [
      { name: 'Play', navigate: () => router.push("/play"), disabled: true, icon: FaGamepad },
      { name: 'Leaderboard', navigate: () => router.push("/leaderboard"), disabled: true, icon: FaTrophy },
      { name: 'Menu', navigate: () => router.push("/"), icon: FaHamburger },
      {
        name: 'Login', navigate: () => router.push("/login"), icon: FaPowerOff // or ("/")
      }],
  }

  const items = (connected ? menuItems.connected : menuItems.disconnected)
  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState(open);
      };

  const menuItemsList = () => (
    <Box
      sx={{ width: 200, color: "rgba(99, 102, 241)", fontWeight: 'bold' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {// contenu du menu lui même (éléments React)
          // Liste des éléments non affichés quand non connecté : Profile / Chat / Friends 
          //
          // Leaderboard ? Play ?
        }


        {items.map((item, index) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton disabled={item.disabled} onClick={item.navigate} color='rgba(99, 102, 241)' >
              <ListItemIcon >
                {item.icon()}

                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText primary={item.name} />:
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='absolute left-3 top-3'>
      <>
        {/* <Button onClick={() => setConnected((connectionStatus) => !connectionStatus)}
        >click me </Button> */}
        <MenuIcon
          //   className='flex justify-center items-center absolute top-4 left-4 bg-indigo-500 text-white rounded-full p-2 hover:bg-white hover:text-indigo-500 transition'
          color={state ? 'primary' : 'secondary'}
          sx={{ color: "rgba(255,255,255)", bgcolor: "rgba(99, 102, 241)", borderRadius: '50%', zIndex: 'left' }}
          fontSize='large'
          onClick={toggleDrawer(true)}>
          <InboxIcon color={state ? 'primary' : 'secondary'}
          />

        </MenuIcon>
        <Drawer
          sx={{ backgroundColor: "secondary" }}
          open={state}
          onClose={toggleDrawer(false)}
        >
          {menuItemsList()}
        </Drawer>
      </>
    </div >
  );
}
