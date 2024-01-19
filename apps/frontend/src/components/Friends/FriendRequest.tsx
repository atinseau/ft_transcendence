import React, { useEffect, useState } from 'react'
import { useStore } from '@/state/store';
import Link from 'next/link';
import { acceptFriendRequest, declineFriendRequest, fetchFriendRequests } from '@api/friends';
import useUserContext from '@contexts/UserContext/useUserContext';
import { Request } from '@interface/Interface';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { createAvatarUrl } from '@utils/createUrl';

const FriendRequest: React.FC = () => {

    const { setFriendRequestOpen, friendRequestOpen } = useStore(state => state.friends);

    const [request, setRequest] = useState<Request[]>([]);
	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    useEffect(() => {
		if (!profile) return;
        async function fetchRequests() {
            const data = await fetchFriendRequests(profile?.id);
            setRequest(data);
        }
        fetchRequests();
    }, [profile]);

    const handleAccept = async (friendRequestId: string) => {
        const response = await acceptFriendRequest(profile?.id, friendRequestId);
        if (response.ok) {
        	setRequest(prevRequest => prevRequest?.filter(request => request.id !== friendRequestId));
			notifcationCtx.enqueueNotification({
				message: `Friend request accepted.`,
				type: "default"
			});
		} else {
			notifcationCtx.enqueueNotification({
				message: `An error has occured trying to accept Friend request.`,
				type: "default"
			});
		}
    }

    const handleDecline = async (friendRequestId: string) => {
        const response = await declineFriendRequest(profile?.id, friendRequestId);
		if (response.ok) {
			setRequest(prevRequest => prevRequest?.filter(request => request.id !== friendRequestId));
			notifcationCtx.enqueueNotification({
				message: `Friend request declined.`,
				type: "default"
			});
		} else {
			notifcationCtx.enqueueNotification({
				message: `An error has occured trying to decline Friend request.`,
				type: "default"
			});
		}
    }

  return (
    <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
        onClick={() => setFriendRequestOpen(false)}>
            <div className='z-30 relative sm:w-[450px] sm:h-[330px] bg-white rounded-xl p-8 pt-0 overflow-auto'
                onClick={(e) => e.stopPropagation()}>
				<div className=' max-h-[50vh] flex flex-col gap-4 py-4'>
					{request?.map((friend) => (
						<div key={friend.id} className='flex items-center justify-between gap-4 pr-5 py-1'>
							<div className='flex items-center gap-4'>
								<Link href={`/profile/${friend.requester.username}`}>
									<div className='h-10 w-10 bg-cover rounded-full hover:cursor-pointer' style={{ backgroundImage:createAvatarUrl(friend.requester.avatar)}}/>
								</Link>
								<p className='text-gray-700'>{friend.requester.username}</p>
							</div>
							<div className='flex gap-2'>
								<button className='w-full py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-600'
									onClick={() => handleAccept(friend.id)}>Accept</button>
								<button className='w-full py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600'	
									onClick={() => handleDecline(friend.id)}>Decline</button>
							</div>
						</div>
					))}
				</div>
            </div>
    </div>
  )
}

export default FriendRequest