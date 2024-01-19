import React from 'react';
import { useStore } from '@/state/store';
import { banUser } from '@api/chat';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import useUserContext from '@contexts/UserContext/useUserContext';

const BanModal: React.FC = () => {
	const { setShowBanModal, activeChannel, targetMember, setTargetMember, chatMembers, setChatMembers } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleBan = async () => {
        if (activeChannel && activeChannel.id && targetMember && profile) {
			if (profile.id == targetMember.user.id) {
				notifcationCtx.enqueueNotification({
					message: `You can't ban yourself.`,
					type: "default"
				});
				setShowBanModal(false);
				setTargetMember(null);
				return ;
			}
			if (targetMember.role == 'creator') {
				notifcationCtx.enqueueNotification({
					message: `You can't ban the creator.`,
					type: "default"
				});
				setShowBanModal(false);
				setTargetMember(null);
				return ;
			}
			const res = await banUser(activeChannel.id, profile?.id, targetMember.user.id)
			if (res.error == "User is not a member of the chat") {
				notifcationCtx.enqueueNotification({
					message: `${targetMember.user.username} is not a member of ${activeChannel.name}.`,
					type: "default"
				});
			} else if (res.error == "Only admin or creator can ban users.") {
				notifcationCtx.enqueueNotification({
					message: `Only admin or creator can ban users.`,
					type: "default"
				});
			} else if (res.error == "Chat not found") {
				notifcationCtx.enqueueNotification({
					message: `${activeChannel.name} not found.`,
					type: "default"
				});
			} else {
				if (chatMembers) {
					const updatedMembers = chatMembers.filter(member => member.id !== targetMember.id);
					setChatMembers(updatedMembers);
				}
				notifcationCtx.enqueueNotification({
					message: `${targetMember.user.username} has been banned from ${activeChannel.name}.`,
					type: "default"
				});
			}
			setShowBanModal(false);
			setTargetMember(null);
	    }
	}


    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowBanModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for banning the user */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to ban this user?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={handleBan}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BanModal;
