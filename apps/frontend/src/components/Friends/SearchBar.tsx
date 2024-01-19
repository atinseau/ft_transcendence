"use client"
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useStore } from '@/state/store';

const SearchBar: React.FC = () => {
    const { search, setSearch } = useStore(state => state.friends);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    return (
        <div className='flex items-center mb-4 w-full'>
            <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-indigo-500'
                type='text'
                placeholder='Search'
                value={search}
                onChange={handleSearchChange}
            />
            <FaSearch className='text-gray-500 max-sm:hidden' size='1.7em' />
        </div>
    );
}

export default SearchBar;
