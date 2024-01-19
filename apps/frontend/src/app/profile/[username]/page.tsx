"use client"
import React from 'react';
import Historic from '@components/Profile/Historic';
import ProfileData from '@components/Profile/ProfileData';
import TWOFAAuth from '@components/Profile/TWOFAAuth';
import InvitePopup from '@components/Game/InvitePopup';
import useInviteContext from '@contexts/InviteContext/useInviteContext';
import MenuButton from '@components/MenuButton';

interface UserProfileProps {
  params: { username: string }
}

const UserProfile: React.FC<UserProfileProps> = ({ params }) => {

  const showInvitePopup = useInviteContext((state) => state.showInvitePopup)

  return (
    <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900 overflow-y-auto'>
      {showInvitePopup && <InvitePopup />}

      {/* Menu Button */}
      <MenuButton />
      {/* Menu Button */}
      <MenuButton />
      <div className='flex gap-3 lg:w-[960px] max-lg:max-w-[300px] max-lg:flex-col'>
        {/* Left */}
        <div className='flex flex-col gap-3'>
          {/* up : User data */}
          <ProfileData username={params.username} />
          {/* down : 2FA Authenticator button*/}
          <TWOFAAuth username={params.username} />
        </div>
        {/* Right : Game Historic*/}
        <Historic username={params.username} />
      </div>
    </div>
  )
};

export default UserProfile;