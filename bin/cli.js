#!/usr/bin/env node

const { startRepl } = require("../src/repl");

async function main() {
    await startRepl();
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
});