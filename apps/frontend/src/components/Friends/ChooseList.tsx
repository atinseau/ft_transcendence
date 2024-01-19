"use client"
import React from 'react';
import { useStore } from '@/state/store';

const ChooseList: React.FC = () => {
    const {
        setDropdownOpen,
        friendList,
        setFriendList,
        setSearch,
        setActiveChatId
    } = useStore(state => state.friends);

    // Everytime we change the toggle, reset the search, and close the dropdown
    const handleFriendList = (x: boolean) => {
        setFriendList(x);
        setDropdownOpen(-1);
        setSearch("");
        setActiveChatId(null);
    }

    return (
        <div className='flex justify-evenly items-center mb-3 w-full cursor-pointer'>
            <div className={`flex-1 text-center p-4 ${friendList ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-gray-100 text-indigo-500'}`} 
                onClick={() => handleFriendList(true)}>
                My friends
            </div>
            <div className={`flex-1 text-center p-4 ${friendList ? 'hover:bg-gray-100 text-indigo-500' : 'bg-indigo-500 text-white font-bold'}`} 
                onClick={() => handleFriendList(false)}>
                <p>All users</p>
            </div>
        </div>
    );
}

export default ChooseList;

