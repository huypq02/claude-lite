import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { optimizePrompt } from "./optimize.js";
import { estimateTokens, percentSaved } from "./tokens.js";
import { callClaude } from "./claude.js";
import { ui } from "./ui.js";

const EXIT_WORDS = new Set(["exit", "quit", ":q"]);

export async function startRepl({ debug = false } = {}) {
    ui.banner();

    const rl = readline.createInterface({ input: stdin, output: stdout });

    // Clean exit on Ctrl+C even if we're between prompts.
    rl.on("SIGINT", () => {
        console.log("\n" + ui.status("bye"));
        rl.close();
        process.exit(0);
    });

    // Main loop. One turn at a time. No concurrency, no surprises.
    while (true) {
        let input;
        try {
            input = await rl.question(ui.user());
        } catch {
            // rl closed (e.g. piped stdin ended)
            break;
        }

        const trimmed = input.trim();
        if (!trimmed) continue;
        if (EXIT_WORDS.has(trimmed.toLowerCase())) break;

        const optimized = optimizePrompt(trimmed);
        const origT = estimateTokens(trimmed);
        const optT = estimateTokens(optimized);

        if (debug) ui.debug(trimmed, optimized);

        console.log(ui.status("Optimized"));

        let response;
        try {
            response = await callClaude(optimized);
        } catch (err) {
            console.log(ui.error(err.message) + "\n");
            continue; // stay in the loop; one bad turn shouldn't kill the session
        }

        console.log("\n" + ui.assistantLabel());
        console.log(response);
        console.log(ui.report({
            origT,
            optT,
            saved: percentSaved(origT, optT),
        }) + "\n");
    }

    rl.close();
    console.log(ui.status("bye"));
}