'use strict';

const socket = io();

window.username = 'herson'; // testing
window.onload = init;


function init() {
    bindSocket();
    bindDOM();

    updateTimestamps();
    setInterval(updateTimestamps, 15000);

}

function bindSocket() {
    let room = getRoomName();
    socket.emit('join', room);
    socket.on('message', logMessage);
}

function bindDOM() {
    const $button = document.querySelector('.message-input .send');
    const $input = document.querySelector('.message-input .content');

    $button.addEventListener('click', emitMessage);
    $input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            emitMessage();
        }
    });
}

function logMessage(message) {
    let $messages = document.querySelector('.messages');
    let div = document.createElement('div');
    div.innerHTML = message;
    $messages.append(div);
    updateTimestamps(div);
}

function emitMessage() {
    const $input = document.querySelector('.message-input .content');
    const message = $input.value.trim();
    const author = window.username;
    
    if (!message) return;
    $input.value = '';
    socket.emit('message', { message, author });
}

function getRoomName() {
    return location.pathname.split('/').pop();
}

function updateTimestamps(parent) {
    parent = parent || document;
    const elements = parent.querySelectorAll('.msg .ago');

    for (let element of elements) {
        let timestampUTC = element.getAttribute('data-timestamp');
        element.innerHTML = moment.utc(+timestampUTC).fromNow();
    }
}