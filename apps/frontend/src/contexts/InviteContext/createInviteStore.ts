import { createStore } from "zustand";

interface InviteProps {
  showInvitePopup: boolean;
  inviterId: string;
}

interface InviteActions {
  setShowInvitePopup: (value: boolean) => void;
  setInviterId: (value: string) => void;
}

type InviteState = InviteProps & InviteActions;
type InviteStore = ReturnType<typeof createInviteStore>;

const createInviteStore = () => {
  return createStore<InviteState>((set) => ({
    showInvitePopup: false,
    inviterId: '',
    setShowInvitePopup: (value) => set({ showInvitePopup: value }),
    setInviterId: (value) => set({ inviterId: value }),
  }));
}

export type {
  InviteStore,
  InviteState,
  InviteProps,
  InviteActions,
}

export default createInviteStore;
