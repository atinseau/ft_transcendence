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

interface AuthModalFormLoginProps {
  register: UseFormRegister<AuthForm>
  errors: FieldErrors<AuthForm>
  getErrorMessage: (field: keyof AuthForm) => string | null
}

const AuthModalFormLogin: React.FC<AuthModalFormLoginProps> = ({
  register,
  errors,
  getErrorMessage
}) => {

  const [showPassword, setShowPassword] = useState(false);

  return <>
    <TextField
      variant="outlined"
      label="Username or email"
      id="username"
      placeholder="Username or email"
      error={errors.username ? true : false}
      helperText={getErrorMessage('username')}
      {...register('username', {
        required: {
          value: true,
          message: 'Username or email is required'
        },
        validate: (value) => {
          if (value.includes('@')) {
            return isEmail(value) ? true : 'Email is not valid'
          }
          return true
        }
      })}
    />
    <TextField
      label="Password"
      variant="outlined"
      type={showPassword ? 'text' : 'password'}
      id="password"
      placeholder="Password"
      error={errors.password ? true : false}
      helperText={getErrorMessage('password')}
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
    <Button type="submit" variant="contained">
      Connexion
    </Button>
  </>
}

export default AuthModalFormLogin