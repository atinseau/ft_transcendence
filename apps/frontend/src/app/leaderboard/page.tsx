"use client"
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import MenuButton from '@components/MenuButton';
import { User, Game } from '@interface/Interface';
import { getUsers } from '@api/friends';
import InvitePopup from '@components/Game/InvitePopup';
import useInviteContext from '@contexts/InviteContext/useInviteContext';
import { createAvatarUrl } from '@utils/createUrl';

const Leaderboard: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
	const fetchData = async () => {
	  try {
			const res = await getUsers();
			const sortedRes = res.sort((a: any, b: any) => b.points - a.points);
			setUsers(sortedRes);
		 	setUsers(res);
	  } catch (error) {
		console.error('Error:', error);
	  }
	};
	fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

	const showInvitePopup = useInviteContext((state) => state.showInvitePopup)

  return (
    <div className='relative flex flex-col items-center justify-center h-screen w-screen bg-gray-900'>
			{ showInvitePopup && <InvitePopup/> }

      {/* Menu Button */}
      <MenuButton/>
      <div className='flex flex-col items-center justify-center gap-3 h-3/4 w-3/4 bg-white rounded-xl shadow-md p-8'>

        <h1 className='text-2xl font-bold mb-8'>Leaderboard</h1>

        {/* SearchBar */}
        <div className='flex items-center mb-4 w-full'>
          <input
            className='w-full px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-indigo-500'
            type='text'
            placeholder='Search'
            value={search}
            onChange={handleSearchChange}
          />
          <FaSearch className='text-gray-500 max-sm:hidden' size='1.7em' />
        </div>

        {/* Players List */}
        <div className='w-full h-full overflow-y-auto '>
          {users?.filter(user => user.username.toLowerCase().includes(search.toLowerCase())).map((user, index) => (
            <div key={index} className='flex w-full min-w-[500px] items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100'>
              {/* PP && Username */}
              <div className='flex gap-4 items-center'>
                <div className='w-12 h-12 bg-cover rounded-full' style={{ backgroundImage:createAvatarUrl(user.avatar)}} />
                <p className='text-gray-700'>{user.username}</p>
              </div>
              {/* Points */}
              <p className='text-gray-700'>{user.points} points</p>
              {/* Matches Won */}
              <p className='text-green-700'>{user.wins} wins</p>
              {/* Matches Lost */}
              <p className='text-red-700'>{user.losses} losses</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;