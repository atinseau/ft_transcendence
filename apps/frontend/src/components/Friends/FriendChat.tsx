'use client'
import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSolidSend } from 'react-icons/bi';
import FriendMessageReceiver from './FriendMessageReceiver';
import MessageSender from '@components/Chat/MessageSender';
import { useStore } from '@/state/store';
import { getFriendshipMessages, sendFriendMessage, checkIfFriendshipExists } from '@api/friends';
import socket from '../../utils/socket';
import useUserContext from '@contexts/UserContext/useUserContext';
import { FriendMessage } from '@interface/Interface';
import { messageDate } from '@utils/formatDate';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const FriendChat: React.FC = () => {
	const [messageContent, setMessageContent] = useState<string>('');
	const {
		activeFriendship,
		messages,
		setMessages,
		setActiveFriendship
	} = useStore(state => state.friends);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

	const scrollRef = useRef<HTMLDivElement | null>(null);

	// socket
	useEffect(() => {
		if (activeFriendship) {
			socket.emit('joinFriendship', activeFriendship.id);

			socket.on('newFriendMessage', (newMessage: FriendMessage) => {
				setMessages(prevMessages => [...prevMessages, newMessage]);
			});

			return () => {
				socket.off('newFriendMessage');
				socket.emit('quitFriendship', activeFriendship.id);
			};
		}
	}, [activeFriendship]);

	useEffect(() => {
		// Scroll to the bottom
		scrollRef.current?.scrollIntoView();
	}, [messages])

	// get messages from database on mount
	useEffect(() => {
		if (activeFriendship) {
			getFriendshipMessages(activeFriendship.id)
				.then(fetchedMessages => {
					setMessages(fetchedMessages);
				});
		}
	}, [activeFriendship]);

	const handleSendMessage = async () => {
		if (!profile) return;
		if (messageContent.trim() && activeFriendship) {
			try {
				const res = await checkIfFriendshipExists(activeFriendship.id);
				if (!res.exist) {
					notifcationCtx.enqueueNotification({
						message: `You can't send message as you are not friends anymore`,
						type: "default"
					});
					return;
				}
				await sendFriendMessage(activeFriendship.id, profile.id, messageContent);
				setMessageContent('');
			} catch (error) {
				notifcationCtx.enqueueNotification({
					message: `Error sending message:`,
					type: "default"
				});
			}
		}
	};

	return (
		<div className='relative flex flex-col bg-white rounded-xl shadow-md p-8 h-full md:w-[500px] lg:w-[760px]'>
			<div className='md:hidden absolute top-2 left-2 cursor-pointer' onClick={() => setActiveFriendship(null)}>
				<AiOutlineClose size={'1.6em'} className='text-indigo-500 hover:text-indigo-600' />
			</div>

			<div className='flex flex-col h-full w-full overflow-y-auto mb-4'>
				{messages.map((msg: FriendMessage, index) => {
					if (msg.sender.username === profile?.username) {
						return <MessageSender key={index} time={messageDate(msg.createdAt)} message={msg.content} username={msg.sender.username} avatar={msg.sender.avatar} />;
					} else {
						return <FriendMessageReceiver key={index} username={msg.sender.username} time={messageDate(msg.createdAt)} message={msg.content} avatar={msg.sender.avatar} />;
					}
				})}
				<div ref={scrollRef} />
			</div>


			{/* Send a message */}
			<div className='w-full flex items-center justify-start border-t-2 border-gray-200 pt-2'>
				<input
					className='mr-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
					placeholder='Type a message'
					value={messageContent}
					onChange={e => setMessageContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSendMessage()
						}
					}}
				/>
				<BiSolidSend
					className='text-indigo-500 hover:cursor-pointer'
					size='1.5em'
					onClick={handleSendMessage}
				/>
			</div>

		</div>
	);
}

export default FriendChat;

