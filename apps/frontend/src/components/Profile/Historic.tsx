'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Game, User } from '@interface/Interface';
import { getUserAndGamesByUsername } from '@api/game';
import useUserContext from '@contexts/UserContext/useUserContext';
import formatUserName from '@utils/formatUserName';


const Historic: React.FC<{ username: string }> = ({ username }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const profile = useUserContext((state) => state.profile)
    const updating = useUserContext((state) => state.updating)

    const isExternalUser = useMemo(() => {
        return !!(
            username
            && profile
            && formatUserName(username) !== formatUserName(profile.username)
        )
    }, [profile])

    useEffect(() => {
        if (!profile || updating) return;
        const fetchData = async () => {
            try {
                const res = await getUserAndGamesByUsername(username);
                setUser(res);
                setGames([...res.gamesAsPlayer1, ...res.gamesAsPlayer2]);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [profile, isExternalUser, updating, username]);


    return (
        <div className='flex flex-col bg-white rounded-xl shadow-md p-8 w-1/2 max-lg:w-full'>
            <div className='w-full'>
                <div className='flex gap-3'>
                    <FaTrophy className='text-indigo-500 mb-2' size={24} />
                    <p className='text-gray-500 mb-2'>History</p>
                </div>
                <div className='flex flex-col gap-3 overflow-y-auto max-h-64'>
                    {games?.map((game, index) => {
                        const date = new Date(game.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                        const opponent = user?.id === game.player1Id ? game.player2 : game.player1;
                        const win = (game.player1Score > game.player2Score && user?.id === game.player1Id) ||
                            (game.player1Score < game.player2Score && user?.id === game.player2Id);
                        const points = win ? "+3" : "-2";

                        return (
                            <div key={index}
                                className={`relative flex items-center justify-evenly rounded-xl px-3 py-1 ${win ? 'bg-green-300' : 'bg-red-300'}`}>
                                <p className='text-xs'>{date}</p>
                                <p>{game.player1Score}</p>
                                <p className='text-gray-700 mb-1'>{opponent?.username}</p>
                                <p>{game.player2Score}</p>
                                <p className='text-xs'>{points}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Historic;
