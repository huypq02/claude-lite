#!/usr/bin/env node
import { Command } from "commander";
import { startRepl } from "../src/repl.js";

const program = new Command();
program
    .name("claude-lite")
    .description("Interactive Claude chat with automatic prompt optimization")
    .option("--debug", "show original vs optimized prompt each turn", false)
    .action(async (opts) => {
        await startRepl({ debug: opts.debug });
    });

program.parseAsync().catch((err) => {
    console.error(err.message);
    process.exit(1);
});