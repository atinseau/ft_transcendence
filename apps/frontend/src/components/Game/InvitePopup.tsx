import React from 'react';
import { useStore } from '@/state/store';
import socket from '@utils/socket';
import useInviteContext from '@contexts/InviteContext/useInviteContext';

const InvitePopup: React.FC = () => {

	const setShowInvitePopup = useInviteContext((state) => state.setShowInvitePopup)
	const inviterId = useInviteContext((state) => state.inviterId)
	const setInviterId = useInviteContext((state) => state.setInviterId)

    const handleInvite = async (accepted: boolean) => {
		setShowInvitePopup(false);
		setInviterId("");
		if (accepted)
			window.location.href = `/game_multi/${inviterId}`;
		else
			socket.emit('refuseGame', { inviter: inviterId });
	}

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowInvitePopup(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                <div className='mt-5 '>
                    <p className='mb-4 text-center'>User invited you to play</p>
					<div className='flex flex-col gap-4'>
						<button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
								onClick={() => handleInvite(true)}>
							Accept
						</button>

						<button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
								onClick={() => handleInvite(false)}>
							Refuse
						</button>
					</div>
                </div>
            </div>
        </div>
    );
}

export default InvitePopup;
