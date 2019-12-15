'use strict';

const socket = io();

window.username = '';
window.onload = init;


function init() {
    bindSocket();
    bindDOM();

    updateTimestamps();
    scrollMessages();
    setUserName();
    setInterval(updateTimestamps, 15000);
}

function bindSocket() {
    let room = getRoomName();
    socket.emit('join', room);
    socket.on('message', (message) => {
        notify(message)
        logMessage(message);
    });
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

    $input.focus();

    window.onfocus = function() {
        setUserName();
    }
}

function setUserName() {
    window.username = window.username || prompt('Enter a username:');
}

function notify(message) {
    if (Notification.permission !== 'granted') {
        return Notification.requestPermission();
    }

    let notification = new Notification(document.title, {
        icon: '/apple-icon.png',
        body: `${message.author}: ${message.message}`,
    });

    notification.onclick = function () {
        window.focus();
    }
}

function logMessage(message) {
    let $messages = document.querySelector('.messages');
    let template = document.querySelector('#message-template').innerHTML;

    let messageHTML = template
        .replace('{author}', message.author)
        .replace('{message}', message.message)
        .replace('{timestamp}', message.timestamp);

    let div = document.createElement('div');
    div.innerHTML = messageHTML;
    
    let scrolled = isScrolled($messages);

    $messages.append(div);
    updateTimestamps(div);

    if (scrolled) {
        scrollMessages();
    }
}

function scrollMessages() {
    let $messages = document.querySelector('.messages');
    $messages.scrollTop = $messages.scrollHeight;
}

function emitMessage() {
    const $input = document.querySelector('.message-input .content');
    const message = $input.value.trim();
    const author = window.username || 'anonymous';
    const timestamp = moment.utc().valueOf();
    
    if (!message) return;
    $input.value = '';
    socket.emit('message', { message, author });
    logMessage({ message, author, timestamp });
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

function isScrolled(element) {
    return (element.scrollHeight - element.scrollTop === element.clientHeight);
}