import React, { useEffect, useState } from 'react';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import useUserContext from '@contexts/UserContext/useUserContext';
import { addFriend, deleteFriend, blockUser, unblockUser, areTheyFriends } from '@api/friends';
import { User } from '@interface/Interface';
import socket from '@utils/socket';

interface ActionsProps {
    friend: User;
	setDropdown: any;
}

const Actions: React.FC<ActionsProps> = ({ friend, setDropdown }) => {
	const [fetch, setFetch] = useState<boolean>(true);
	const [isAlreadyFriend, setIsAlreadyFriend] = useState<boolean>(false);
	const [isFriendBlocked, setIsFriendBlocked] = useState<boolean>(false);

	const notifcationCtx = useNotificationContext();
	const profile = useUserContext((state) => state.profile);

	async function checkFriendshipStatus() {
		if (!profile) return;
		try {
			const areFriends = await areTheyFriends(profile.id, friend.id);
			setIsAlreadyFriend(areFriends);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to check friendship status: ${error}`,
				type: "default"
			});
		}
	}

	useEffect(() => {
		if (!profile) return;
		checkFriendshipStatus();
		setIsFriendBlocked(profile.blockedFriends.includes(friend.id))
	}, [profile, friend, fetch]); // Adding the `fetch` dependency so the check runs again when fetch state changes


	// Invite friend to play
    const handleInviteToPlay = async (friendId: string) => {
		if (!profile) return;
		// Emit the game invitation
		socket.emit('inviteFriendToPlay', { inviter: profile.id, invitee: friendId }); 

		// Redirect to the game waiting room for multiplayer
		window.location.href = `/game_multi/${friendId}`;
	}

	// Add user to friend
	async function handleAddFriend() {
		setDropdown(false);
		if (isFriendBlocked) {
			notifcationCtx.enqueueNotification({
				message: `You can't add ${friend.username} because he is blocked.`,
				type: "default"
			});
			return ;
		}
		try {
			const updatedUser = await addFriend(profile?.id, friend.id);
			if (updatedUser.blocked) {
				notifcationCtx.enqueueNotification({
					message: `You can't add ${friend.username} because he blocked you.`,
					type: "default"
				});
				return ;
			}
			else if (updatedUser.alreadyRequested) {
				notifcationCtx.enqueueNotification({
					message: `Friend request to ${friend.username} has already been sent.`,
					type: "default"
				});
			}
			else if (updatedUser.alreadyFriends) {
				notifcationCtx.enqueueNotification({
					message: `You are already friend with ${friend.username}.`,
					type: "default"
				});
			}
			else {
				notifcationCtx.enqueueNotification({
					message: `Friend request has been sent successfully`,
					type: "default"
				});
			}
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to send request to friend: ${error}`,
				type: "default"
			});
		}
	}

    // Delete user from friend
    const handleDeleteFriend = async () => {
		setDropdown(false);
        try {
            const updatedUser = await deleteFriend(profile?.id, friend?.id);
			notifcationCtx.enqueueNotification({
				message: `User is no longer your friend`,
				type: "default"
			});
            setFetch(!fetch);
        } catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to delete friend: ${error}`,
				type: "default"
			});
        }
    }

	// block a user
	async function handleBlockUser() {
		setDropdown(false);
		try {
			await blockUser(profile?.id, friend?.id);
			notifcationCtx.enqueueNotification({
				message: `User has been blocked`,
				type: "default"
			});
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to block profile: ${error}`,
				type: "default"
			});
		}
	}

	// unblock a user
	async function handleUnblockUser() {
		setDropdown(false);
		try {
			await unblockUser(profile?.id, friend?.id);
			notifcationCtx.enqueueNotification({
				message: `User has been unblocked`,
				type: "default"
			});
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to unblock profile: ${error}`,
				type: "default"
			});
		}
	}

  	return (
		<div className='relative'>
			<div className='absolute z-20 right-0 w-40 mt-2 bg-white border rounded shadow-xl'>
				<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
					onClick={() => handleInviteToPlay(friend.id)}>
						Invite to play
				</div>
				<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
					onClick={() => isAlreadyFriend ? handleDeleteFriend() : handleAddFriend()}>
						{isAlreadyFriend ? "Delete friend" : "Add friend"}
				</div>
				<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
					onClick={() => isFriendBlocked ? handleUnblockUser() : handleBlockUser()}>
					{isFriendBlocked ? "Unblock profile" : "Block profile"}
				</div>
			</div>
		</div>
  	)
}

export default Actions
