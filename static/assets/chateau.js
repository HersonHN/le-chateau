'use strict';

const socket = io();

window.onload = init;


function init() {
    bindSocket();
    bindDOM();
}

function bindSocket() {
    socket.on('msg', (msg) => logMessage(msg));
}

function bindDOM() {
    const button = document.querySelector('.say-hello');
    button.addEventListener('click', emitMessage);
}

function logMessage(message) {
    console.log('message:', message);
}

function emitMessage() {
    console.log('saying hi...');
    socket.emit('msg', 'hello world');
}

