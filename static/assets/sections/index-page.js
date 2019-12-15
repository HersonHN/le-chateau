'use strict';

// <section class="message-input">
//     <input class="content" type="text" maxlength="40" />
//     <button class="send">Go</button>
// </section>

window.onload = init;

function init() {
    const $button = document.querySelector('.message-input .send');
    const $input = document.querySelector('.message-input .content');

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