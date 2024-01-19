import React from 'react';
import { useStore } from '@/state/store';

const ToggleChannel: React.FC = () => {
    
    const { userChannels, setUserChannels } = useStore(state => state.chat);

    return (
        <div className='flex justify-evenly items-center mb-3 w-full cursor-pointer'>
            <div className={`flex-1 text-center p-4 ${userChannels ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-gray-100 text-indigo-500'}`} 
                onClick={() => setUserChannels(true)}>
                My channels
            </div>
            <div className={`flex-1 text-center p-4 ${userChannels ? 'hover:bg-gray-100 text-indigo-500' : 'bg-indigo-500 text-white font-bold'}`} 
                onClick={() => setUserChannels(false)}>
                <p>Join channels</p>
            </div>
        </div>
    )
}

export default ToggleChannel;