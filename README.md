Le Château
==========

A place to chat.

This projects runs on node and uses mongodb as storage for the chats.

### Before Installing

Make sure you have node and mongo installed on your computer/server.

### Installing

    git clone https://github.com/HersonHN/le-chateau.git
    cd le-chateau
    npm install

### Configuring

You'll need to set two environmental variables before run, the mongodb connection
string and the port to run the server.

    export CHATEAU_DB="mongodb://user:pass@host:27017/database"
    export CHATEAU_PORT=1991

### Running

    npm run start

or 

    node .