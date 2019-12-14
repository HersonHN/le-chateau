'use strict';

const socket = io();

socket.on('msg', (message) => {
    console.log('message:', message);
});
