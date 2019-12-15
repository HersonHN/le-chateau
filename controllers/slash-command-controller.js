
const util = require('util');
const path = require('path');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

const slashCommands = require('../slash-commands/list');

module.exports = { parseCommand };

function parseCommand({ message, author }) {

    let found = findCommand(message);
    if (found.error) {
        return Promise.resolve(found);
    }

    let response = executeCommand(found, { message, author });
    return response;
}

function findCommand(message) {
    let command = {};
    for (let com of slashCommands) {
        let matches = message.match(com.match);
        if (matches) {
            command = com;
            command.query = [matches];
            break;
        }
    }

    if (!command.command) {
        return { error: 'Command not found' };
    }

    return command;
}

async function executeCommand(command, originalMessage) {
    let dir = path.join(__dirname, '..');

    let { stdout, stderr } = await exec(command.run, { cwd: dir })

    if (stderr) {
        console.error(stderr);
    }
    console.log(command.command);
    console.log(stdout);

    if (command.selfMessage) {
        return {
            message: stdout,
            author: '🤖',
            bot: true,
            selfMessage: true
        }
    }

    return {
        author: originalMessage.author,
        message: stdout
    };

}