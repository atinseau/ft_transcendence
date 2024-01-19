import React from 'react';
import Link from 'next/link';
import { createAvatarUrl } from '@utils/createUrl';

interface FriendMessageReceiverProps {
    username: string;
    time: string;
    message: string;
    avatar:string;
}

const FriendMessageReceiver: React.FC<FriendMessageReceiverProps> = ({ username, time, message, avatar }) => {
    return (
        <div className='max-w-[75%] self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'>
			<Link href={`/profile/${username}`}>
            	<div className='flex-shrink-0 h-10 w-10 bg-cover rounded-full mr-3 hover:cursor-pointer' style={{ backgroundImage:createAvatarUrl(avatar)}}/> 
			</Link>
            <div>
                <p>{username} · {time}</p> 
                <p>{message}</p>
            </div>
        </div>
    );
}

export default FriendMessageReceiver;
