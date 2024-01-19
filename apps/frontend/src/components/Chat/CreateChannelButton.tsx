import React from 'react';
import { BiPlus } from "react-icons/bi";
import { useStore } from '@/state/store';

const CreateChannelButton: React.FC = () => {

    const { setCreateOpen } = useStore(state => state.chat);

    return (
        <button 
            className='absolute -top-[62px] min-[400px]:top-1 min-[400px]:-left-16 p-2 rounded-full bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 transition flex items-center justify-center'
            onClick={() => setCreateOpen(true)}
        >
            <BiPlus size='1.7em'/>
        </button>
    )
}

export default CreateChannelButton;
