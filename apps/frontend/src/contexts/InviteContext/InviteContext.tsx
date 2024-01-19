'use client'
import { createContext, useContext, useEffect, useRef } from "react";
import socket from "@utils/socket";
import createInviteStore, { InviteState, InviteStore } from "./createInviteStore";
import { useStore } from "zustand";

export const InviteContext = createContext({} as InviteStore);

type InviteProviderProps = React.PropsWithChildren<{}>;

const InviteProvider: React.FC<InviteProviderProps> = ({ children }) => {
  const inviteStoreRef = useRef<InviteStore>();

  if (!inviteStoreRef.current) {
    inviteStoreRef.current = createInviteStore();
  }

  const setShowInvitePopup = useStore(inviteStoreRef.current, state => state.setShowInvitePopup);
  const setInviterId = useStore(inviteStoreRef.current, state => state.setInviterId);

  useEffect(() => {
    socket.on('inviteGame', (data) => {
		setShowInvitePopup(true);
		setInviterId(data.userId);
    });

    socket.on('gameRefused', () => {
      window.history.back();
    });

    return () => {
      socket.off('inviteGame');
    };
  }, []);

  return (
    <InviteContext.Provider value={inviteStoreRef.current}>
      {children}
    </InviteContext.Provider>
  );
};

export default InviteProvider;
