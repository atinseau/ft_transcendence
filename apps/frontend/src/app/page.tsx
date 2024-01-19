import React from 'react'
import Link from 'next/link';
import { FaGamepad, FaUsers, FaComments,  FaTrophy } from 'react-icons/fa';
import AuthButtons from "@components/AuthButtons/AuthButtons";
import UserLink from '@components/UserProfile/UserLink';

export default async function Home() {

  return (
    <div className='flex gap-4 items-center justify-center flex-col h-screen w-screen bg-gray-900'>
      <div className='flex items-center justify-center gap-6 text-white text-lg'>
		
        {/* Play */}
        <Link href="/play" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaGamepad className='h-12 w-12' />
          <p>Play</p>
        </Link>

        {/* Profile */}
        <UserLink/>

        {/* Friends */}
        <Link href="/friends" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaUsers className='h-12 w-12' />
          <p>Friends</p>
        </Link>

        {/* Chat */}
        <Link href="/chat" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaComments className='h-12 w-12' />
          <p>Chat</p>
        </Link>

        {/* Leaderboard */}
        <Link href="/leaderboard" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaTrophy className='h-12 w-12' />
          <p>Leaderboard</p>
        </Link>

      </div>

      {/* <UserProfile /> */}
      <AuthButtons />

    </div>
  )
}

