'use strict';

window.onload = init;

function init() {
    const $button = document.querySelector('.room-input .send');
    const $input = document.querySelector('.room-input .content');

    $button.addEventListener('click', () => {
        visitChatroom($input.value);
    });

    $input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            visitChatroom($input.value);
        }
    });

    $input.focus();
}

function visitChatroom(room) {
    room = room.replace(/\s/g, '-').toLowerCase();
    console.log('room', room);
    window.location.pathname = `/room/${room}`;
}