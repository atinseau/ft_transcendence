import { io } from 'socket.io-client';
import createUrl from './createUrl';

const socket = io(createUrl(), {
    withCredentials: true,
});

export default socket;