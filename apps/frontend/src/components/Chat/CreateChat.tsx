import React from 'react'
import { useStore } from '@/state/store';
import { createChat } from '@api/chat';
import { ChatType } from '@interface/Interface';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const CreateChat: React.FC = () => {

    const { 
        setCreateOpen, 
        channelType,
        setChannelType,
		channelName,
		setChannelName,
        password, 
        setPassword,
    } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleChannelTypeChange = (channelType: ChatType) => {
        setChannelType(channelType);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleChannelNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelName(event.target.value);
    }

	
	const handleCreateChat = async (type: ChatType, name: string, password?: string) => {
		 // If name only have white space or is empty
		if (!name || !name.trim()) {
			notifcationCtx.enqueueNotification({
				message: `The name of your channel cannot be empty.`,
				type: "default"
			});
			return ;
		}
		if (!profile) return;
            try {
                const response = await createChat(type, name, profile.id, password);
				notifcationCtx.enqueueNotification({
					message: `Channel ${response.name} has been created.`,
					type: "default"
				});
				setCreateOpen(false);
            } catch (error) {
				notifcationCtx.enqueueNotification({
					message: `An error has occured.`,
					type: "default"
				});
            }
	}

  return (
    <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
        onClick={() => setCreateOpen(false)}>
        <div className='z-30 relative sm:w-[450px] sm:h-[330px] bg-white rounded-xl p-8 pt-0'
            onClick={(e) => e.stopPropagation()}>
            {/* Form for creating a new Channel */}
            <div className='mt-5'>
                <div className='mb-4'>
                    <label htmlFor="ChannelName" className="block text-gray-700 text-sm font-bold mb-2">Channel Name:</label>
                    <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                            id="ChannelName" 
                            type="text" 
                            placeholder="Enter Channel name" 
							value={channelName}
							onChange={handleChannelNameChange}
                    />
                </div>

                <div className='mb-4 flex max-sm:flex-col'>
                    <div 
                        className={`p-4 text-center hover:cursor-pointer flex-grow ${channelType === 'public' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                        onClick={() => handleChannelTypeChange(ChatType.public)}>
                        <p>PUBLIC</p>
                    </div>
                    <div 
                        className={`p-4 text-center hover:cursor-pointer flex-grow ${channelType === 'protected' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                        onClick={() => handleChannelTypeChange(ChatType.protected)}>
                        <p>PROTECTED</p>
                    </div>
                    <div 
                        className={`p-4 text-center hover:cursor-pointer flex-grow ${channelType === 'private' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                        onClick={() => handleChannelTypeChange(ChatType.private)}>
                        <p>PRIVATE</p>
                    </div>  
                </div>

                {channelType === 'protected' && 
                    <div className='mb-4'>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                id="password" 
                                type="password" 
                                placeholder="Enter channel's password" 
                                value={password}
                                onChange={handlePasswordChange}
                        />
                    </div>
                }

                <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 hover:border hover:border-indigo-500'
					onClick={() => handleCreateChat(channelType, channelName, password)}>
                    Create Channel
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreateChat
