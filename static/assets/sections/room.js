'use strict';

(function() {

    const socket = io();
    window.onload = init;

    function init() {
        bindSocket();
        bindDOM();
        
        if (sessionStorage.username) {
            welcome();
        } else {
            focus('.username-input .content');
        }
    }

    function welcome() {
        scrollMessages();
        focus('.message-input .content');

        let $window = document.querySelector('.username-window');
        $window.classList.add('hidden');

        updateTimestamps();
        setInterval(updateTimestamps, 15000);
    }

    function bindSocket() {
        let room = getRoomName();
        socket.emit('join', room);
        socket.on('message', (message) => {
            logMessage(message);
            if (!message.selfMessage) {
                notify(message)
            }
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

        let username = $input.value;
        if (!username) return alert('Enter your username');
        if (username.length > 20) return alert('Username too long');

        sessionStorage.username = username;

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
            notification.close();
        }
    }

    function logMessage({ html }) {
        let $messages = document.querySelector('.messages');
        let div = document.createElement('div');
        div.innerHTML = html;
        
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
        let author = sessionStorage.username || 'anonymous';
        
        if (!message) return;
        $input.value = '';
        socket.emit('message', { message, author });
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

}())