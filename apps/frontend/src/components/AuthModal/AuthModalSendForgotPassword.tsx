

import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { AuthForm } from "./AuthModal"
import { isEmail } from "@utils"

import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react"

interface AuthModalSendForgotPasswordProps {
  register: UseFormRegister<AuthForm>
  errors: FieldErrors<AuthForm>
  getErrorMessage: (field: keyof AuthForm) => string | null
}

const AuthModalSendForgotPassword: React.FC<AuthModalSendForgotPasswordProps> = ({
  register,
  errors,
  getErrorMessage
}) => {

  return <>
    <TextField
      variant="outlined"
      label="Email"
      id="email"
      placeholder="email"
      error={errors.email ? true : false}
      helperText={getErrorMessage('email')}
      {...register('email', {
        required: {
          value: true,
          message: 'Email is required'
        },
        validate: (value) => {
          return isEmail(value) ? true : 'Email is not valid'
        }
      })}
    />
    <Button type="submit" variant="contained">
      reset password
    </Button>
  </>
}

export default AuthModalSendForgotPassword