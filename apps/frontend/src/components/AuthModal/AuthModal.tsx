'use client';

import useAuthContext from "@contexts/AuthContext/useAuthContext"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"


import { FieldErrors, SubmitHandler, UseFormRegister, useForm } from 'react-hook-form'
import { useCallback, useEffect, useMemo } from "react"
import AuthModalForm from "./AuthModalForm"
import AuthModalFormLogin from "./AuthModalFormLogin"
import AuthModalFormRegister from "./AuthModalFormRegister"
import type { AuthProps } from "@contexts/AuthContext/createAuthStore"
import TwoFAModal from "./TwoFAModal"
import AuthModalSendForgotPassword from "./AuthModalSendForgotPassword"
import AuthModalForgotReset from "./AuthModalForgotReset";


export interface AuthForm {
  username: string
  email: string
  password: string
}

const forms: Record<NonNullable<AuthProps['authMode']>, React.FC<{
  register: UseFormRegister<AuthForm>,
  errors: FieldErrors<AuthForm>
  getErrorMessage: (field: keyof AuthForm) => string | null
}>> = {
  login: AuthModalFormLogin,
  register: AuthModalFormRegister,
  forgotPassword: AuthModalSendForgotPassword
}

const AuthModal = () => {

  const modalOpen = useAuthContext((state) => state.modalOpen)
  const toggleModal = useAuthContext((state) => state.toggleModal)
  const login = useAuthContext((state) => state.login)
  const register = useAuthContext((state) => state.register)
  const forgotPassword = useAuthContext((state) => state.forgotPassword)

  const resetPasswordModal = useAuthContext((state) => state.resetPasswordModal)
  const authMode = useAuthContext((state) => state.authMode)
  const authError = useAuthContext((state) => state.authError);

  const twoFactorModal = useAuthContext((state) => state.twoFactorModal)

  const {
    register: registerField,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthForm>()


  const submit: SubmitHandler<AuthForm> = useCallback((body) => {
    if (authMode === 'login') {
      login({
        password: body.password,
        username: body.username
      })
    } else if (authMode === 'register') {
      register({
        email: body.email,
        password: body.password,
        username: body.username
      })
    } else if (authMode === 'forgotPassword') {
      forgotPassword(body.email)
    }
  }, [authMode])

  const getErrorMessage = useCallback((field: keyof AuthForm) => {
    if (errors[field]) {
      return errors[field]?.message || 'Le champ est invalide'
    }
    return null
  }, [errors])

  const Form = useMemo(() => {
    return authMode ? forms[authMode] : null
  }, [authMode, authError])

  useEffect(() => {
    if (!authError) return

    if (authError.errors) {
      authError.errors.forEach((error) => {
        setError(error.property as keyof AuthForm, {
          type: "pattern",
          message: error.messages[0]
        }, {
          shouldFocus: true
        })
      })
    }
  }, [authError])

  return <Modal
    open={modalOpen}
    onClose={() => {
      toggleModal()
      reset()
    }}
    className="flex items-center justify-center"
    aria-labelledby="Modal de connexion / inscription"
    aria-describedby="Ce modal permet de se connecter ou de s'inscrire"
  >
    <Box className="max-w-[335px] flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8">
      {twoFactorModal
        ? <TwoFAModal />
        : (
          resetPasswordModal
            ? <AuthModalForgotReset />
            : <AuthModalForm
              onSubmit={handleSubmit(submit)}
              reset={reset}
            >
              {Form && <Form
                register={registerField}
                errors={errors}
                getErrorMessage={getErrorMessage}
              />}
            </AuthModalForm>)}
    </Box>
  </Modal>
}

export default AuthModal