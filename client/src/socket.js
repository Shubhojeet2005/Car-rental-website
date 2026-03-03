import { io } from 'socket.io-client';
import { API_URL } from './config';

// Create and export a single socket instance
const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
});

export default socket;
