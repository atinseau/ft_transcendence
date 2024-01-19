import React from 'react';
import { useStore } from '@/state/store';
import { deleteMember } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const LeaveChannel: React.FC = () => {

    const { setShowLeaveModal, activeChannel, setActiveChannel, setMyGroups, myGroups, setSettings } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleLeaveChannel = async () => {
        if (activeChannel && activeChannel.id && profile) {
            try {
                const response = await deleteMember(activeChannel.id, profile.id);
				if (response.id || response.message === "Chat successfully deleted") {
					notifcationCtx.enqueueNotification({
						message: `You have left ${activeChannel.name} successfully.`,
						type: "default"
					});
					setActiveChannel(null);
					setSettings(false);
					const updatedGroups = myGroups.filter(group => group.id !== activeChannel.id);
					setMyGroups(updatedGroups);
				}
				setShowLeaveModal(false);
            } catch (error) {
				notifcationCtx.enqueueNotification({
					message: `An error has occured`,
					type: "default"
				});
            }
        }
    }

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowLeaveModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to leave this channel?</p>
 
                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={handleLeaveChannel}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LeaveChannel;
