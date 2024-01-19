import React, { useState, useRef, useEffect } from 'react';
import { BsCameraFill } from 'react-icons/bs';
import { useStore } from '@/state/store';
import { UseFormRegister } from 'react-hook-form';
import { UpdateForm } from './ProfileData';
import convertFileToBase64 from '@utils/convertFileToBase64';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import styled from '@emotion/styled'
type style = { backgroundImage: string }
type data = string;
interface AvatarProps {
  avatarURL: string,
  register: UseFormRegister<UpdateForm>,
  disabled: boolean
}

const Span = styled.span`
  svg {
    display: none;
  }
  :hover svg {
    display: block;
  }
`
const FILE_SIZE_OCTET = 5000000; //5MB

const ModifiableAvatar: React.FC<AvatarProps> = ({ avatarURL, register, disabled}) => {

  const [backgroundImage, setBackgroundImage] = useState(avatarURL)

  const notificationCtx = useNotificationContext()

  useEffect( () => {setBackgroundImage(avatarURL)},[avatarURL])

  const handleBackgroundImage = async (file: File | null) => {
    if (!file) return
    else if (file.size > FILE_SIZE_OCTET) 
    {
        notificationCtx.enqueueNotification({
        message: 'File too big',
        type: 'error'})
      return
    }
    else if (file.type !== "image/jpeg" && file.type !== "image/png")
    {
      notificationCtx.enqueueNotification({
        message: 'File type error, please use jpeg or png',
        type: 'error'})
      return
    }
    try {
      const base64url = await convertFileToBase64(file)
      setBackgroundImage(base64url)
    } catch (e) {
      notificationCtx.enqueueNotification({
        message: (e as Error)?.message || 'An error occured',
        type: 'error'
      })
    }
  }

  return (

    <>
      <input
      disabled={disabled}
        {...register('avatarImage', {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleBackgroundImage(e.target.files?.[0] || null)
          }
        })}
        id="avatarImage"
        accept="image/*"
        type="file"
        style={{ display: 'none' }}
      />
      <label htmlFor="avatarImage">
        <Span
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
          className={`flex justify-center items-center h-24 w-24  bg-cover rounded-full border border-gray-200 ${disabled ?'' : 'hover:cursor-pointer'}` }
        >
{disabled ? <></> : <BsCameraFill
                    size={'2em'}
                  />}
        </Span>
      </label>
    </>
  )
}
export default ModifiableAvatar;