import { useContext } from "react";
import { UserContext } from "./UserContext";
import type { UserState } from "./createUserStore";
import { useStore } from "zustand";


function useUserContext<T>(selector: (state: UserState) => T): T {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error('useUserContext must be used within an UserProvider')
  }
  return useStore(userContext, selector)
}

export default useUserContext;