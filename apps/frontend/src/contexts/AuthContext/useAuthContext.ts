import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthState } from "./createAuthStore";
import { useStore } from "zustand";


function useAuthContext<T>(selector: (state: AuthState) => T): T {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return useStore(authContext, selector)
}

export default useAuthContext;