import React, { ChangeEvent, useState } from 'react';
import { useStore } from '@/state/store';
import useUserContext from '@contexts/UserContext/useUserContext';
import { muteMember } from '@api/chat';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const MuteModal: React.FC = () => {
    const [minutes, setMinutes] = useState(1);
    const { setShowMuteModal, activeChannel, targetMember, setTargetMember } = useStore(state => state.chat);

    const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMinutes(Number(e.target.value));
    }

    const handleMute = async (duration: number) => {
        if (activeChannel && activeChannel.id && targetMember && targetMember.id && profile) {
			if (profile.id == targetMember.user.id) {
				notifcationCtx.enqueueNotification({
					message: `You can't mute yourself.`,
					type: "default"
				});
				setShowMuteModal(false);
				setTargetMember(null);
				return ;
			}
			if (targetMember.role == 'creator') {
				notifcationCtx.enqueueNotification({
					message: `You can't mute the creator.`,
					type: "default"
				});
				setShowMuteModal(false);
				setTargetMember(null);
				return ;
			}
            try {
                const res = await muteMember(activeChannel.id, profile.id, targetMember.user.id, duration);
				if (res.error == "Only admin or creator can mute users.") {
					notifcationCtx.enqueueNotification({
						message: `Only admin or creator can mute users.`,
						type: "default"
					});
					setShowMuteModal(false);
					setTargetMember(null);
					return ;
				}
				notifcationCtx.enqueueNotification({
					message: `${targetMember.user.username} has been muted ${duration} minutes.`,
					type: "default"
				});
                setShowMuteModal(false);
				setTargetMember(null);
            } catch (error) {
				notifcationCtx.enqueueNotification({
					message: `An error has occured trying to mute the member.`,
					type: "default"
				});
            }
        }
    }


    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowMuteModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Form for muting the user */}
                <div className='mt-5'>
                    <div className='mb-4'>
                        <label htmlFor="muteDuration" className="block text-gray-700 text-sm font-bold mb-2">Duration (minutes):</label>
                        <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                id="muteDuration" 
                                type="number" 
                                value={minutes}
                                onChange={handleChange}
                        />
                    </div>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={() => handleMute(minutes)}>
                        Mute User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MuteModal;
