import React, { useEffect } from 'react';
import { useStore } from '@/state/store';
import useUserContext from '@contexts/UserContext/useUserContext';
import socket from '../../utils/socket';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { isAdmin } from '@api/chat';

const KickModal: React.FC = () => {

    const {
		setShowKickModal, activeChannel, targetMember, 
		setTargetMember, chatMembers, setChatMembers,
		setActiveChannel, setSettings, setMessages
	} = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleKick = async () => {
        if (activeChannel && activeChannel.id && targetMember && profile) {
			if (profile.id == targetMember.user.id) {
				notifcationCtx.enqueueNotification({
					message: `You can't kick yourself.`,
					type: "default"
				});
				setShowKickModal(false);
				setTargetMember(null);
				return ;
			}
			const checkAdmin = await isAdmin(activeChannel.id, profile.id);
			if (!checkAdmin.ok) {
				notifcationCtx.enqueueNotification({
					message: `Only admin or creator can kick users.`,
					type: "default"
				});
				setShowKickModal(false);
				setTargetMember(null);
				return ;
			}
			if (targetMember.role == 'creator') {
				notifcationCtx.enqueueNotification({
					message: `You can't kick the creator.`,
					type: "default"
				});
				setShowKickModal(false);
				setTargetMember(null);
				return ;
			}
			notifcationCtx.enqueueNotification({
				message: `${targetMember.user.username} has been kicked from ${activeChannel.name}.`,
				type: "default"
			});
			socket.emit('kickUserFromChat', { chatId: activeChannel.id, adminUserId: profile.id, targetUserId: targetMember.user.id } );
			setShowKickModal(false);
			setTargetMember(null);
        }
    }

    useEffect(() => {
        if (activeChannel && activeChannel.id && profile) {
			socket.on("userKicked", (data) => {
				if (data.kickedUserId === profile.id) {
					setActiveChannel(null);
					setMessages([]);
					setSettings(false);
				}
				else if (chatMembers && targetMember) {
					const updatedMembers = chatMembers.filter(member => member.id !== targetMember.id);
					setChatMembers(updatedMembers);
				}
			});

			return () => {
				socket.off("userKicked");
			};
        }
    }, [activeChannel]);


    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowKickModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for kicking the user */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to kick this user?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={handleKick}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KickModal;
