const chalk = require("chalk");

function formatInfo(message) {
    return chalk.cyan(message);
}

function formatOutput(message) {
    return chalk.green(message);
}

function formatError(message) {
    return chalk.red(message);
}

module.exports = {
    formatError,
    formatInfo,
    formatOutput,
};