import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    // Use the same host for production, or localhost for development
    const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
    return io(backendUrl, options);
};