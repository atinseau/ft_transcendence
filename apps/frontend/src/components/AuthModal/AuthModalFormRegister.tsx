import { FieldErrors, UseFormRegister } from "react-hook-form"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { AuthForm } from "./AuthModal"
import { isEmail } from "@utils"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react"

interface AuthModalFormRegisterProps {
  register: UseFormRegister<AuthForm>
  errors: FieldErrors<AuthForm>
  getErrorMessage: (field: keyof AuthForm) => string | null
}

const AuthModalFormRegister: React.FC<AuthModalFormRegisterProps> = ({
  register,
  errors,
  getErrorMessage
}) => {

  const [showPassword, setShowPassword] = useState(false);

  return <>
    <TextField
      variant="outlined"
      label="Email"
      placeholder="Email"
      id="email"
      error={errors.email ? true : false}
      helperText={getErrorMessage('email')}
      {...register('email', {
        required: {
          value: true,
          message: 'Email is required'
        },
        validate: (value) => isEmail(value) ? true : 'Email is not valid'
      })}
    />
    <TextField
      variant="outlined"
      label="Username"
      id="username"
      placeholder="Username"
      error={errors.username ? true : false}
      helperText={getErrorMessage('username')}
      {...register('username', {
        required: {
          value: true,
          message: 'Username is required'
        },
        maxLength: {
          value: 20,
          message: 'Username cannot be longer than 20 characters'
        },
        validate: (value) => {
          const regex = /^[a-z0-9_.-]*$/
          return regex.test(value) ? true : 'You can only use letters (miniscule), numbers, underscores, dots and dashes'
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
      S'inscrire
    </Button>
  </>
}

export default AuthModalFormRegister