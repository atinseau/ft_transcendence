"use client"
import React from 'react';
import ChooseList from '@components/Friends/ChooseList';
import FriendChat from '@components/Friends/FriendChat';
import FriendList from '@components/Friends/FriendList';
import FriendRequest from '@components/Friends/FriendRequest';
import FriendRequestButton from '@components/Friends/FriendRequestButton';
import SearchBar from '@components/Friends/SearchBar';
import MenuButton from '@components/MenuButton';
import { useStore } from '@/state/store';
import InvitePopup from '@components/Game/InvitePopup';
import useInviteContext from '@contexts/InviteContext/useInviteContext';

const Friends: React.FC = () => {

    const { friendRequestOpen, activeFriendship } = useStore(state => state.friends);
	const showInvitePopup = useInviteContext((state) => state.showInvitePopup)

	return (
		<div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>
			{ showInvitePopup && <InvitePopup/> }
			{/* Menu Button */}
			<MenuButton/>

            {/* Friend request modal */}
            {friendRequestOpen ? <FriendRequest /> : null}
			<div className='flex items-center justify-center gap-3 h-[700px] w-[1440px]'>
				{/* Left : Friend list / Users list */}
				<div className={`relative flex flex-col gap-3 h-full ${activeFriendship && 'max-md:hidden'}`}>
					<div className='h-full flex flex-col items-center justify-start bg-white rounded-xl shadow-md overflow-y-auto'>
					{/* Friend request button */}
					<FriendRequestButton />
					{/* Choose Friend List or Users List */}
					<ChooseList />
					<div className='flex flex-col items-center justify-start overflow-y-auto w-full px-7 pb-7 '>
						{/* SearchBar */}
						<SearchBar/>
						{/* Friends List */}
						<FriendList/>
					</div>
					</div>
				</div>
				{/* Right : Chat */}
				<div className={`h-full ${activeFriendship ? '' : 'max-md:hidden'}`}>
					<FriendChat/>
				</div>
			</div>
		</div>
	)
}

export default Friends;