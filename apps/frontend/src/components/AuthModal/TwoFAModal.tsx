'use client'

import { Button, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import { useCallback, useEffect, useRef } from "react"
import { AuthForm } from "./AuthModal"
import { UseFormRegister } from "react-hook-form"
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext"
import useAuthContext from "@contexts/AuthContext/useAuthContext"

const SIZE_OF_CODE = 6

interface TwoFAModalProps {
}

const TwoFAModal: React.FC<TwoFAModalProps> = () => {

  const inputRefs = useRef<HTMLInputElement[]>([])
  const completeTwoFactor = useAuthContext((state) => state.completeTwoFactor)
  const twoFactorRetryCredentials = useAuthContext((state) => state.twoFactorRetryCredentials)
  const notificationCtx = useNotificationContext()
  const login = useAuthContext((state) => state.login)


  const handleSubmit = useCallback((e: any) => {
    e.preventDefault()
    const password = inputRefs.current.map((el) => el.value).join('')
    if (password.length < SIZE_OF_CODE) {
      notificationCtx.enqueueNotification({
        type: "error",
        message: "Code is too short, please try again"
      })
      return 
    }
    completeTwoFactor(password)
  }, [])

  const retry = useCallback(() => {
    if (!twoFactorRetryCredentials) {
      return
    }
    login(twoFactorRetryCredentials)
  }, [twoFactorRetryCredentials])

  return <Box>
    <h1 className="text-3xl font-bold mb-8">Enter your 2fa code</h1>
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        {Array.from({ length: SIZE_OF_CODE }).map((_, i) => <TextField
          onChange={(e) => {
            if (e.target.value.length > 1) {
              e.target.value = e.target.value[e.target.value.length - 1]
            }
            if (e.target.value.length < 1) {
              if (i > 0) {
                inputRefs.current[i - 1].focus()
              }
            } else if (e.target.value.length >= 1) {
              if (i < SIZE_OF_CODE - 1) {
                inputRefs.current[i + 1].focus()
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && (e.target as HTMLInputElement).value.length === 0) {
              if (i > 0) {
                inputRefs.current[i - 1].focus()
              }
            }
          }}
          InputProps={{
            inputRef: (el: HTMLInputElement) => inputRefs.current[i] = el,
          }}
          inputProps={{
            className: "text-xl text-center px-0",
          }}
          key={i}
        />)}
      </div>
      <Button type="submit" variant="contained">
        Connexion
      </Button>
    </form>

    <div className='text-center flex gap-1 max-sm:flex-col mt-4'>
      <p className='text-gray-500'>You didn't receive the code ?</p>
      <a className='text-indigo-500 hover:underline cursor-pointer' onClick={retry}>RESEND</a>
    </div>
  </Box>
}

export default TwoFAModal