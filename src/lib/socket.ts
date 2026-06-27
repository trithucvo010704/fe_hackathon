import { io, Socket } from 'socket.io-client';
import { getStoredToken } from './auth';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) return socket;

  const token = getStoredToken();
  const wsUrl = import.meta.env.VITE_WS_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000/bz';
  const wsPath = import.meta.env.VITE_WS_PATH || process.env.NEXT_PUBLIC_WS_PATH || '/ws';

  console.log('Initializing socket connection to:', wsUrl, 'with path:', wsPath);

  socket = io(wsUrl, {
    path: wsPath,
    auth: token ? { token: `Bearer ${token}` } : {},
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
