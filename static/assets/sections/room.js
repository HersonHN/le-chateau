'use strict';

const socket = io();
window.onload = init;


function init() {
    bindSocket();
    bindDOM();
    focus('.username-input .content');
}

function welcome() {
    scrollMessages();
    focus('.message-input .content');

    updateTimestamps();
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
    let $messageInput = document.querySelector('.message-input');
    let $usernameInput = document.querySelector('.username-input');


    addEventToNiceInput($messageInput, emitMessage);
    addEventToNiceInput($usernameInput, setUserName);

    function addEventToNiceInput($parent, fn) {
        let $button = $parent.querySelector('button');
        let $input = $parent.querySelector('input');

        $button.addEventListener('click', fn);
        $input.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                fn();
            }
        });
    }
}

function focus(query) {
    let $input = document.querySelector(query);
    $input.focus();
}

function setUserName() {
    let $input = document.querySelector('.username-input input');
    let $window = document.querySelector('.username-window');

    let username = $input.value;
    if (!username) return alert('Enter your username');
    if (username.length > 20) return alert('Username too long');

    $window.classList.add('hidden');
    window.username = username;

    welcome();
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
    let $input = document.querySelector('.message-input .content');
    let message = $input.value.trim();
    let author = window.username || 'anonymous';
    let timestamp = moment.utc().valueOf();
    
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
    let elements = parent.querySelectorAll('.msg .ago');

    for (let element of elements) {
        let timestampUTC = element.getAttribute('data-timestamp');
        element.innerHTML = moment.utc(+timestampUTC).fromNow();
    }
}

function isScrolled(element) {
    return (element.scrollHeight - element.scrollTop === element.clientHeight);
}