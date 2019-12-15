
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
            command.query = matches[0];
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

    let shellCommand = `${command.run} "${command.query}"`;
    let { stdout, stderr } = await exec(shellCommand, {
        cwd: dir,
        env: process.env,
    });

    if (stderr) {
        console.error(stderr);
    }

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