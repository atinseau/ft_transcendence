import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { FormEvent, useCallback, useEffect, useState } from "react";

import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import useAuthContext from "@contexts/AuthContext/useAuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";

const AuthModalForgotReset = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const forgotCallback = useAuthContext((state) => state.forgotCallback)
  const authError = useAuthContext((state) => state.authError)

  const notificationCtx = useNotificationContext()

  const router = useRouter()
  const params = useSearchParams()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState
  } = useForm<{ password: string, confirmPassword: string }>()

  const { errors } = formState

  const submit = useCallback(async (e: { password: string, confirmPassword: string }) => {
    if (e.password !== e.confirmPassword) {
      notificationCtx.enqueueNotification({
        message: 'Passwords do not match',
        type: 'error'
      })
      return
    }
    const token = params.get('reset-token')
    if (!token) {
      notificationCtx.enqueueNotification({
        message: 'There is no reset token in the url',
        type: 'error'
      })
      router.push('/')
      return
    }
    await forgotCallback(token, e.password, () => {
      router.push('/')
    }, () => {
      router.push('/')
    })
  }, [])

  useEffect(() => {
    if (!authError) return
    if (authError.errors) {
      authError.errors.forEach((error) => {
        setError(error.property as 'password', {
          type: "pattern",
          message: error.messages[0]
        }, {
          shouldFocus: true,
        })
      })
    }
  }, [authError])


  const getErrorMessage = useCallback((field: 'password' | 'confirmPassword') => {
    if (errors[field]) {
      return errors[field]?.message || 'Le champ est invalide'
    }
    return null
  }, [errors])

  const handler = handleSubmit(submit)


  return <Box>
    <h1 className="text-3xl font-bold mb-8 text-center">Enter your new password</h1>
    <form className="flex flex-col gap-4" onSubmit={(e) => {
      clearErrors()
      handler(e)
    }}>
      <TextField
        label="New password"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        id="password"
        error={errors.password ? true : false}
        helperText={getErrorMessage('password')}
        placeholder="Password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...register('password', {
          required: {
            value: true,
            message: 'Password is required'
          }
        })}
      />
      <TextField
        label="Confirm new password"
        variant="outlined"
        type={showConfirmPassword ? 'text' : 'password'}
        id="confirmPassword"
        placeholder="Confirm password"
        error={errors.confirmPassword ? true : false}
        helperText={getErrorMessage('confirmPassword')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...register('confirmPassword', {
          required: {
            value: true,
            message: 'Confirm password is required'
          }
        })}
      />
      <Button type="submit" variant="contained">
        Reset password
      </Button>
    </form>
  </Box>
}

export default AuthModalForgotReset