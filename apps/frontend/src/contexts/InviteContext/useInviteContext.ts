import { useContext } from "react";
import { InviteContext } from "./InviteContext";
import type { InviteState } from "./createInviteStore";
import { useStore } from "zustand";

function useInviteContext<T>(selector: (state: InviteState) => T): T {
  const inviteContext = useContext(InviteContext);

  if (!inviteContext) {
    throw new Error('useInviteContext must be used within an InviteProvider');
  }
  return useStore(inviteContext, selector);
}

export default useInviteContext;
