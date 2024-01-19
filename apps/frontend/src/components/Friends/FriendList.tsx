"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsThreeDots } from 'react-icons/bs';
import { useStore } from '@/state/store';
import useUserContext from '@contexts/UserContext/useUserContext';
import { getFriends, addFriend, deleteFriend, blockUser, unblockUser, getBlockedUsers, getFriendship, getUsers } from '@api/friends';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { User } from '@interface/Interface';
import socket from '@utils/socket';
import { createAvatarUrl } from '@utils/createUrl';

const FriendList: React.FC = () => {
	const [fetch, setFetch] = useState<boolean>(true);
	const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

	const {
		dropdownOpen,
		setDropdownOpen,
		friendList,
		search,
		friends,
		activeChatId,
		setActiveChatId,
		setFriends,
		setActiveFriendship,
	} = useStore(state => state.friends);

	const notifcationCtx = useNotificationContext();
	const profile = useUserContext((state) => state.profile);

	const toggleDropdown = (event: any, index: number) => {
		event.stopPropagation();
		setDropdownOpen(index === dropdownOpen ? -1 : index);
	}

	const fetchList = async () => {
		if (!profile) return;
		try {
			// Fetch friends or users based on the friendList boolean
			const fetchedData = friendList ? await getFriends(profile.id) : await getUsers();
			if (fetchedData.msg == "User has no friend" || fetchedData.msg == "User not found") {
				setFriends([]);
				return;
			}
			if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0) {
				if (!friendList) {
					const filteredData = fetchedData.filter(userItem => userItem.username !== profile.username);
					setFriends(filteredData);
				} else {
					setFriends(fetchedData);
				}
			} else {
				setFriends([]);
			}
		} catch (error) {
			console.error('Error fetching list:', error);
		}
	};

	const fetchBlockedUsers = async () => {
		if (!profile) return;
		try {
			const result = await getBlockedUsers(profile?.id);
			setBlockedUsers(result);  // Assuming result is an array of usernames that are blocked
		} catch (error) {
			console.error("Failed to fetch blocked users:", error);
		}
	}

	// get friend or user list
	useEffect(() => {
		fetchList();
		fetchBlockedUsers();
	}, [fetch, friendList, profile]);

	// check if a profile is blocked to show "unblock" instead
	const isUserBlocked = (friendId: string) => {
		return blockedUsers.includes(friendId);
	};

	// for the searchbar
	const filteredList = friends.filter(friend =>
		friend.username.toLowerCase().includes(search.toLowerCase())
	);



	// socket
	useEffect(() => {
		socket.on('refetch', (userId: string) => {
			if (profile?.id === userId) {
				setFetch(!fetch);
			}
		});

		return () => {
			socket.off('refetch');
		};
	}, []);

	// Get the friendship id to open the chat
	async function getFriendChat(friend: any) {
		try {
			const friendship: any = await getFriendship(profile?.id, friend.id);

			console.log(friendship)

			setActiveFriendship(friendship);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to get friendship chat: ${error}`,
				type: "default"
			});
		}
	};


	// Invite friend to play
	const handleInviteToPlay = async (friendId: string) => {
		// Emit the game invitation
		socket.emit('inviteFriendToPlay', { inviter: profile?.id, invitee: friendId });

		// Redirect to the game waiting room for multiplayer
		window.location.href = `/game_multi/${friendId}`;
	}

	// Add user to friend
	async function handleAddFriend(friend: User) {
		setDropdownOpen(-1);
		if (isUserBlocked(friend.id)) {
			notifcationCtx.enqueueNotification({
				message: `You can't add ${friend.username} because he is blocked.`,
				type: "default"
			});
			return;
		}
		try {
			const updatedUser = await addFriend(profile?.id, friend.id);
			if (updatedUser.blocked) {
				notifcationCtx.enqueueNotification({
					message: `You can't add ${friend.username} because he blocked you.`,
					type: "default"
				});
				return;
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
			socket.emit('refetch', { friendId: friend.id });
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to send request to friend: ${error}`,
				type: "default"
			});
		}
	}


	// Delete user from friend
	const handleDeleteFriend = async (friendId: string) => {
		setDropdownOpen(-1);
		try {
			const updatedUser = await deleteFriend(profile?.id, friendId);
			notifcationCtx.enqueueNotification({
				message: `User is no longer your friend`,
				type: "default"
			});
			socket.emit('refetch', friendId);
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to delete friend: ${error}`,
				type: "default"
			});
		}
	}

	// block a user
	async function handleBlockUser(blockedId: string) {
		setDropdownOpen(-1);
		try {
			await blockUser(profile?.id, blockedId);
			notifcationCtx.enqueueNotification({
				message: `User has been blocked`,
				type: "default"
			});
			socket.emit('refetch', blockedId);
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to block profile: ${error}`,
				type: "default"
			});
		}
	}

	// unblock a user
	async function handleUnblockUser(blockedId: string) {
		setDropdownOpen(-1);
		try {
			await unblockUser(profile?.id, blockedId);
			notifcationCtx.enqueueNotification({
				message: `User has been unblocked`,
				type: "default"
			});
			socket.emit('refetch', blockedId);
			setFetch(!fetch);
		} catch (error) {
			notifcationCtx.enqueueNotification({
				message: `Failed to unblock profile: ${error}`,
				type: "default"
			});
		}
	}

	return (
		<div className='w-full h-full'>
			{filteredList.map((friend, index) => {
				return (
					<div
						key={friend.id}
						className={"flex items-center justify-between p-4 border-b border-gray-200 hover:bg-indigo-200 hover:cursor-pointer" + (friend.id === activeChatId ? " bg-indigo-200" : "")}
						onClick={() => {
							if (friendList) {
								setActiveChatId(friend.id);
								getFriendChat(friend);
							}
						}}
					>

						{/* Profile Picture and Username */}
						<div className='flex items-center relative'>
							<Link href={`/profile/${friend.username}`}>
								<div className='h-12 w-12 bg-cover rounded-full mr-4' style={{ backgroundImage: createAvatarUrl(friend.avatar) }} />
							</Link>
							<p className='text-gray-700'>{friend.username}</p>
						</div>

						{/* Status */}
						<div>
							<div className={`
							h-3 w-3 
							rounded-full 
							${friend.status === 'online' ? 'bg-green-500' :
									friend.status === 'offline' ? 'bg-red-500' :
										friend.status === 'ingame' ? 'bg-yellow-400' : ''}
						`} />
						</div>

						{/* Actions */}
						<div>
							<BsThreeDots className='text-gray-500 cursor-pointer'
								onClick={(event: any) => toggleDropdown(event, index)} />
							{dropdownOpen === index && (
								<div className='absolute z-20 right-0 w-40 mt-2 bg-white border rounded shadow-xl'>
									<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
										onClick={() => handleInviteToPlay(friend.id)}>
										Invite to play
									</div>
									<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
										onClick={() => friendList ? handleDeleteFriend(friend.id) : handleAddFriend(friend)}>
										{friendList ? "Delete friend" : "Add friend"}
									</div>
									<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
										onClick={() => isUserBlocked(friend.id) ? handleUnblockUser(friend.id) : handleBlockUser(friend.id)}>
										{isUserBlocked(friend.id) ? "Unblock profile" : "Block profile"}
									</div>
								</div>
							)}
						</div>
					</div>
				)
			})}
		</div>
	);
}

export default FriendList;
