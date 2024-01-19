import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BsFillPeopleFill, BsFillUnlockFill } from 'react-icons/bs';
import { BiSolidLockAlt } from 'react-icons/bi';
import { useStore } from '@/state/store';
import { Chat } from '@interface/Interface';
import { getAllChats } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';

const JoinableChannels: React.FC = () => {
    const { search, setSearch, setShowJoinModal, setClickedGroup } = useStore(state => state.chat);
    const [groups, setGroups] = useState<Chat[]>([]);

	const profile = useUserContext((state) => state.profile);

    useEffect(() => {
		if (!profile) return;
        const fetchChats = async () => {
            const fetchedGroups = await getAllChats(profile.id);
            setGroups(fetchedGroups);
        }

        fetchChats();
    }, [profile]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const groupsFiltered = groups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase())
    );

	const handleClick = (group: Chat | null) => {
		setClickedGroup(group);
		setShowJoinModal(true);
	}

  return (
    <div className='md:w-[250px] lg:w-[350px] h-[700px] flex flex-col items-center justify-start overflow-y-auto p-8 pt-0'>
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

        {/* List of user's groups */}
        <div className='w-full overflow-y-auto'>
            {groupsFiltered.map((group, index) => (
                <div key={index} className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-200 hover:cursor-pointer'
					onClick={() => handleClick(group)}>
                    {/* Group name */}
                    <div className='flex items-center'>
                        <p className='text-gray-700'>{group.name}</p>
                    </div>
                    {
                        group.type === "public" ?
                        <BsFillPeopleFill />
                        :
                        (
                            group.type === "protected" ?
                            <BsFillUnlockFill />
                            :
                            <BiSolidLockAlt />
                        )
                    }
                </div>
            ))}
        </div>
    </div>
  )
}

export default JoinableChannels;
