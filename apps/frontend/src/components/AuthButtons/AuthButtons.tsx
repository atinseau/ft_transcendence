'use client';

import useAuthContext from "@contexts/AuthContext/useAuthContext";
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";
import { useEffect } from "react";
import useUserContext from "@contexts/UserContext/useUserContext";
import socket from "@utils/socket";

import Button from '@mui/material/Button'

const AuthButtons = () => {

	const profile = useUserContext((state) => state.profile);


  const startAuth = useAuthContext((state) => state.startAuth)

  const logout = useAuthContext((state) => state.logout)
  const isLogged = useAuthContext((state) => state.isLogged)

  const handleLogout = () => {
	if (profile)
		socket.emit('setStatus', { userId: profile.id, status: "offline" });
	logout();
  }

  return <div className="flex gap-2">
    {!isLogged && <Button variant="contained" onClick={() => startAuth('login')}>Login</Button>}
    {!isLogged && <Button variant="contained" onClick={() => startAuth('register')}>Register</Button>}
    {isLogged && <Button variant="contained" onClick={() => handleLogout()}> Logout </Button>}
  </div>
}

export default AuthButtons;