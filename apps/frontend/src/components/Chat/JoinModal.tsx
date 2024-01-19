import React, { useState } from 'react';
import { useStore } from '@/state/store';
import { addMember } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const JoinModal: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const { setShowJoinModal, clickedGroup } = useStore(state => state.chat);
	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

	const handleAddMember = async () => {
		if (clickedGroup && profile) {
			if (clickedGroup.type === 'protected') {
				if (password !== clickedGroup.password) {
					notifcationCtx.enqueueNotification({
						message: `Wrong password.`,
						type: "default"
					});
					setShowJoinModal(false);
					return;
				}
			}
	
			if (clickedGroup.type === 'private') {
				const isUserInvited = clickedGroup.invited?.some(invite => invite.userId === profile.id);
				if (!isUserInvited) {
					notifcationCtx.enqueueNotification({
						message: `You are not invited to this channel.`,
						type: "default"
					});
					setShowJoinModal(false);
					return;
				}
			}

			const res = await addMember(clickedGroup.id, profile.id);
			if (res.error == 'This user is banned from the chat.') {
				notifcationCtx.enqueueNotification({
					message: `You are banned from ${clickedGroup.name} channel.`,
					type: "default"
				});
				return ;
			}
			if (res.alreadyMember) {
				notifcationCtx.enqueueNotification({
					message: `You are already a member of ${clickedGroup.name}.`,
					type: "default"
				});
				return ;
			}
			notifcationCtx.enqueueNotification({
				message: `You have joined ${clickedGroup.name} successfully!`,
				type: "default"
			});
			setShowJoinModal(false);
		}
	}

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowJoinModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for kicking the user */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to join this channel?</p>

                    {clickedGroup && clickedGroup.type === 'protected' && (
                        <div className="mb-4">
                            <label className="block mb-2">Enter Password:</label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                    )}

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={() => handleAddMember()}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinModal;