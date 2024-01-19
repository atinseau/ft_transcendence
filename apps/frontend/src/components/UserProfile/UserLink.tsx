'use client';
import { FaUser } from 'react-icons/fa';
import Link from "next/link"
import useUserContext from '@contexts/UserContext/useUserContext';
import formatUserName from '@utils/formatUserName';

const UserLink = () => {
  const profile = useUserContext((state) => state.profile)
  if (!profile) return null;

  return <Link href={"/profile/" + formatUserName(profile.username)} className='flex flex-col items-center text-white hover:text-indigo-500'>
    <FaUser className='h-12 w-12' />
    <p>Profile</p>
  </Link>
}

export default UserLink