'use client';

import { createContext, useEffect, useRef } from "react";
import type { AuthState, AuthStore } from "./createAuthStore";
import createAuthStore from "./createAuthStore";
import AuthModal from "@components/AuthModal/AuthModal";
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";
import { useRouter, useSearchParams } from 'next/navigation'

export const AuthContext = createContext({} as AuthStore)

type AuthProviderProps = React.PropsWithChildren<{
  initialState?: Partial<AuthState>
}>

const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialState }) => {

  const authStoreRef = useRef<AuthStore>()
  const notificationContext = useNotificationContext()
  
  const router = useRouter()
  const params = useSearchParams()

  if (!authStoreRef.current) {
    authStoreRef.current = createAuthStore({
      notificationContext,
      router,
      initialState
    })
  }

  useEffect(() => {
    const resetToken = params.get('reset-token')
    if (!resetToken) {
      return
    }
    authStoreRef.current?.setState({
      resetPasswordModal: true,
      modalOpen: true,
    })
  }, [])

  return <AuthContext.Provider value={authStoreRef.current}>
    {children}
    <AuthModal />
  </AuthContext.Provider>
}

export default AuthProvider