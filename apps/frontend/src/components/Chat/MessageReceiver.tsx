import React, { useState } from 'react';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Actions from './Actions';
import { User } from '@interface/Interface';
import {createAvatarUrl} from '@utils/createUrl';

interface MessageReceiverProps {
    time: string;
    message: string;
	friend: User;
    avatar: string;
}

const MessageReceiver: React.FC<MessageReceiverProps> = ({ time, message, friend, avatar }) => {
	const [dropdown, setDropdown] = useState<boolean>(false);

    return (
        <div className='relative max-w-[75%] self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'>
			<div className='absolute -right-6 top-1/2 -translate-y-1/2 hover:cursor-pointer' >
				<BsThreeDotsVertical 
					onClick={() => setDropdown(!dropdown)}/>
				{ dropdown && <Actions friend={ friend } setDropdown={ setDropdown }/>}
			</div>
			<Link href={`/profile/${friend.username}`}>
            	<div className='flex-shrink-0 h-10 w-10 bg-cover rounded-full mr-3 hover:cursor-pointer' style={{ backgroundImage:createAvatarUrl(avatar)}}/> 
			</Link>
            <div>
                <p>{friend.username} · {time}</p> 
                <p>{message}</p>
            </div>
        </div>
    );
}

export default MessageReceiver;
