"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import ModifiableAvatar from './AvatarUpload';
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField';
import { SubmitHandler, useForm } from 'react-hook-form';
import useUserContext from '@contexts/UserContext/useUserContext';
import { createUrl } from '@utils';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { User } from '@interface/Interface';
import { getUserByUsername } from '@api/friends';
import { Skeleton } from '@mui/material';
import formatUserName from '@utils/formatUserName';
import { useRouter } from 'next/navigation';

export type UpdateForm = {
  username: string
  avatarImage: FileList
}

interface ProfileDataProps {
  username: string;
}

const ProfileData: React.FC<ProfileDataProps> = ({ username }) => {
  const [user, setUser] = useState<User>();
  const profile = useUserContext((state) => state.profile);
  const updating = useUserContext((state) => state.updating);
  const notifcationCtx = useNotificationContext();

  const fetchingExternalUser = useRef(false);

  const router = useRouter()

  const checkIsExternalUser = () => {
    return !!(
      username
      && profile
      && formatUserName(username) !== formatUserName(profile.username)
    )
  }

  const getExternalUser = useCallback(async () => {
    if (fetchingExternalUser.current) return;
    try {
      fetchingExternalUser.current = true;
      const fetchedUser = await getUserByUsername(username);
      setUser(fetchedUser);
      fetchingExternalUser.current = false;
    } catch (error) {
      notifcationCtx.enqueueNotification({
        message: `This user does not exist`,
        type: "error"
      });
      router.push('/')
    }
  }, [username])

  useEffect(() => {
    if (updating) return;
    if (checkIsExternalUser()) {
      getExternalUser();
      return;
    }
    setUser(profile as unknown as User)
  }, [
    profile,
  ])

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {
      errors,
    }
  } = useForm<UpdateForm>()

  const updateProfile = useUserContext((state) => state.updateProfile)

  //modif fonction Submit
  const onSubmit: SubmitHandler<UpdateForm> = useCallback(async (body) => {
    updateProfile(body, () => {
      if (body.username !== profile?.username && body.username?.length > 0) {
        router.push(`/profile/${formatUserName(body.username)}`)
      }
    })
  }, [])

  const getErrorMessage = useCallback((field: keyof UpdateForm) => {
    if (errors[field]) {
      return errors[field]?.message || 'Le champ est invalide'
    }
    return null
  }, [errors])

  const avatarURL = user?.avatar
    ? (user.avatar.includes('https://') ? user.avatar : createUrl(user.avatar))
    : undefined

  const wins = user?.wins ? user.wins : 0;
  const losses = user?.losses ? user.losses : 0
  const winrate = (wins + losses !== 0) ? (wins / (wins + losses) * 100).toFixed(2) : 0;
  const points = user?.points ? user.points : 0
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'
    >
      {/* Profile Picture */}
      <div className='relative flex items-center justify-evenly mb-4 w-full'>
        {!user || !avatarURL
          ? <Skeleton variant="circular" width={"6rem"} height={"6rem"} />
          : <ModifiableAvatar disabled={checkIsExternalUser()}
            avatarURL={avatarURL}
            register={register}
          />}
        <div className='ml-4'>
          <div className='flex gap-1'>
            <p>{wins} W</p>
            <p>{losses} L</p>
          </div>
          <p>Winrate: {winrate}%</p>
          <p>{points} Points</p>
        </div>
      </div>
      {/* Username */}
      <div className='mb-4 w-full'>
        {!user
          ? <Skeleton height={"56px"} />
          : <TextField
            {...register('username', {
              value: user?.username,
              required: true,
              maxLength: {
                value: 20,
                message: 'Username cannot be longer than 20 characters'
              },
              validate: (value) => {
                const regex = /^[a-z0-9_.-]*$/
                return regex.test(value) ? true : 'You can only use letters (minuscule), numbers, underscores, dots and dashes'
              }
            })}
            disabled={checkIsExternalUser()}
            InputLabelProps={{ shrink: true }}
            error={!!errors.username} // TODO : mettre un max de char pour le username
            helperText={getErrorMessage('username')}
            className='w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
            type='text'
            label="Username"
          />
        }
      </div>
      {/* use of MUI for optimized  form filling */}
      {!checkIsExternalUser() && <Button
        disabled={checkIsExternalUser() || Object.values(errors).some(error => error) || !profile}
        color="primary"
        type="submit"
        variant="contained"
      >
        Submit
      </Button>}
    </form>
  );
}

export default ProfileData;
