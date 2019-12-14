'use strict';

const socket = io();

window.onload = init;


function init() {
    bindSocket();
    bindDOM();
}

function bindSocket() {
    let room = getRoomName();
    console.log('joining room:', room);
    socket.emit('join', room);
    socket.on('message', logMessage);
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
    socket.emit('message', { content: 'hello world', room: getRoomName() });
}

function getRoomName() {
    return location.pathname.split('/').pop();
}
