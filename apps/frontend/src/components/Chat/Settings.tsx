import React, { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { useStore } from '@/state/store';
import { getChatMembers, updateChatName, updateChatPassword } from '@api/chat';
import { Member } from '@interface/Interface';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import useUserContext from '@contexts/UserContext/useUserContext';
import { createAvatarUrl } from '@utils/createUrl';

const Settings: React.FC = () => {
    const { 
        setSettings, channelName, setChannelName, channelPassword,
        setChannelPassword, setShowInviteModal,
        setShowLeaveModal, setShowEraseModal,
        setShowKickModal, setShowMuteModal, setShowBanModal,
		activeChannel, setTargetMember, chatMembers, setChatMembers,
		setActiveChannel, setShowAdminModal
    } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();
	
	useEffect(() => {
        const fetchChatMembers = async () => {
            try {
				if (activeChannel && activeChannel.id) {
					const members = await getChatMembers(activeChannel.id);
					setChatMembers(members);
					setChannelName(activeChannel.name);
				}
            } catch (error) {
				notifcationCtx.enqueueNotification({
					message: `An error has occured.`,
					type: "default"
				});
            }
        };

        fetchChatMembers();
    }, [activeChannel]);

	const handleAction = (action: string, target: Member) => {
		if (action == "kick") {
			setShowKickModal(true)
		} else if (action == "mute") {
			setShowMuteModal(true)
		} else if (action == "admin") {
			setShowAdminModal(true)
		} else {
			setShowBanModal(true)
		}
		setTargetMember(target);
	}

	const handleUpdate = async (type: 'name' | 'password') => {
		if (!profile) return;
		try {
			if (activeChannel) {
				if (type === 'name') {
					const res = await updateChatName(activeChannel.id, channelName, profile.id);
					if (res.error) {
						notifcationCtx.enqueueNotification({
							message: res.error,
							type: "default"
						});
					} else {
						notifcationCtx.enqueueNotification({
							message: `Channel name has successfully been changed to ${res.name}.`,
							type: "default"
						});
					}
					setChannelName("");
					setActiveChannel(res);
				} else if (type === 'password') {
					const res = await updateChatPassword(activeChannel.id, channelPassword, profile.id);
					if (res.error) {
						notifcationCtx.enqueueNotification({
							message: res.error,
							type: "default"
						});
					} else {
						notifcationCtx.enqueueNotification({
							message: `Channel password has successfully been changed.`,
							type: "default"
						});
					}
					setChannelPassword("");
				}
			}
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `An error has occured updating channel.`,
				type: "default"
			});
		}
	};


    const handleChannelNameChange = (e: ChangeEvent<HTMLInputElement>) => setChannelName(e.target.value);
    const handleChannelPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setChannelPassword(e.target.value);

    return (
        <div className='relative flex flex-col bg-white rounded-xl shadow-md p-8 h-full md:w-[400px] lg:w-[570px] xl:w-[760px] overflow-auto'>
            <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setSettings(false)}>
                <AiOutlineClose size={'1.6em'} className='text-indigo-500 hover:text-indigo-600'/>
            </div>
            <div className='flex flex-col gap-4 pb-6'> 
                <label className='text-gray-500'>Channel Name:</label>
				<div className='flex items-center gap-2'>
					<input 
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
						type="text" 
						value={channelName}
						onChange={handleChannelNameChange}
					/>
					<button 
						className='p-2 bg-indigo-500 text-white rounded hover:bg-indigo-700'
						onClick={() => handleUpdate('name')}>
						Update
					</button>
				</div>
                <label className='text-gray-500'>Channel Password:</label>
				<div className='flex items-center gap-2'>
					<input 
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
						type="password" 
						value={channelPassword}
						onChange={handleChannelPasswordChange}
					/>
					<button 
						className='p-2 bg-indigo-500 text-white rounded hover:bg-indigo-700'
						onClick={() => handleUpdate('password')}>
						Update
					</button>
				</div>
            </div>
            <label className='text-gray-500'>Users:</label>
            <div className='overflow-y-auto max-h-[50vh] flex-1'>
                {/* Channel members list */}
                <div className='flex flex-col'>
                    {chatMembers?.map((member, index) => (
                    <div key={index} className='flex items-center justify-between gap-4 pr-5 py-1'>
						<Link href={`/profile/${member.user.username}`}>
                        	<div className='h-10 w-10 bg-cover rounded-full hover:cursor-pointer' style={{ backgroundImage:createAvatarUrl(member.user.avatar)}}/>
						</Link>
                        <p className='text-gray-700 flex-grow'>{member.user.username}</p>
                        <p className='text-gray-500 flex-grow text-sm'>{member.role}</p>
                        <div className='flex gap-2'>
                            <button className='px-2 py-1 bg-amber-500 text-white rounded hover:cursor-pointer hover:bg-amber-700' 
                                onClick={() => handleAction("admin", member)}>Admin</button>
                            <button className='px-2 py-1 bg-blue-500 text-white rounded hover:cursor-pointer hover:bg-blue-700' 
                                onClick={() => handleAction("kick", member)}>Kick</button>
                            <button className='px-2 py-1 bg-yellow-500 text-white rounded hover:cursor-pointer hover:bg-yellow-700'
                                onClick={() => handleAction("mute", member)}>Mute</button>
                            <button className='px-2 py-1 bg-red-500 text-white rounded hover:cursor-pointer hover:bg-red-700'
                                onClick={() => handleAction("ban", member)}>Ban</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            {/* Channel setting buttons */}
            <div className='flex flex-col gap-4 pt-4'>
                {/* Invite users */}
                <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 hover:cursor-pointer' 
                    onClick={() => setShowInviteModal(true)}>
                        Invite Users
                </button>
                {/* Leave channel */}
                <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 hover:cursor-pointer'
                    onClick={() => setShowLeaveModal(true)}>
                        Leave Channel
                </button>
                {/* Erase channel */}
                <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 hover:cursor-pointer'
                    onClick={() => setShowEraseModal(true)}>
                        Erase Channel
                </button>
            </div>
        </div>
    )
}

export default Settings;
