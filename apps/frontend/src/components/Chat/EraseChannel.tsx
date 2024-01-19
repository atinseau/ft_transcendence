import React from 'react';
import { useStore } from '@/state/store';
import { deleteChat } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const EraseChannel: React.FC = () => {

    const { setShowEraseModal, activeChannel, setActiveChannel, myGroups, setMyGroups, setSettings } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleEraseChannel = async () => {
        if (activeChannel && activeChannel.id && profile) {
            try {
                const res = await deleteChat(activeChannel.id, profile.id);
				if (res.error) {
					notifcationCtx.enqueueNotification({
						message: res.error,
						type: "default"
					})
				} else {
					notifcationCtx.enqueueNotification({
						message: `Channel ${activeChannel.name} has been deleted.`,
						type: "default"
					});
					setActiveChannel(null);
					setSettings(false);
					const updatedGroups = myGroups.filter(group => group.id !== activeChannel.id);
					setMyGroups(updatedGroups);
				}
				setShowEraseModal(false);
            } catch (error) {
				notifcationCtx.enqueueNotification({
					message: `An error has occured.`,
					type: "default"
				});
            }
        }
    }

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowEraseModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for erasing the channel */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to erase this channel?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={handleEraseChannel}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EraseChannel;
