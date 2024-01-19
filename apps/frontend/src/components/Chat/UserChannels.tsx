import React, { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useStore } from '@/state/store';
import useUserContext from '@contexts/UserContext/useUserContext';
import { Chat } from '@interface/Interface';
import { getUserChats } from '@api/chat';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const UserChannels: React.FC = () => {
    const { search, setSearch, activeChannel, setActiveChannel, myGroups, setMyGroups } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

	useEffect(() => {
		const fetchChats = async () => {
			if (profile && profile.id) {
				try {
					const fetchedGroups = await getUserChats(profile.id);
					if (Array.isArray(fetchedGroups)) {
						setMyGroups(fetchedGroups);
					} else {
						notifcationCtx.enqueueNotification({
							message: `An error has occured.`,
							type: "default"
						});
					}
				} catch (error) {
					notifcationCtx.enqueueNotification({
						message: `An error has occured.`,
						type: "default"
					});
				}
			}
		}
		
		fetchChats();
	}, [profile, activeChannel]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const groupsFiltered = myGroups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase())
    );

	const getActiveChannel = (group: Chat | null) => {
		setActiveChannel(group);
	}

    return (
        <div className='md:w-[250px] lg:w-[350px] h-[700px] flex flex-col items-center justify-start overflow-y-auto p-8 pt-0 '>
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
						onClick={() => getActiveChannel(group) }>
                        {/* Group name */}
                        <div className='flex items-center'>
                            <p className='text-gray-700'>{group.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserChannels
