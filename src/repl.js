const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const { runClaude } = require("./claude");
const { cleanPrompt } = require("./optimize");
const { estimateTokens } = require("./tokens");
const { formatError, formatInfo, formatOutput } = require("./ui");

async function startRepl() {
    const rl = readline.createInterface({
        input: stdin,
        output: stdout,
    });

    stdout.write(formatInfo("claude-lite repl. Type 'exit' to quit.\n"));

    try {
        while (true) {
            const answer = await rl.question("> ");
            const prompt = cleanPrompt(answer);

            if (!prompt) {
                continue;
            }

            if (prompt.toLowerCase() === "exit") {
                break;
            }

            stdout.write(formatInfo(`Estimated tokens: ${estimateTokens(prompt)}\n`));

            try {
                const result = await runClaude(prompt);
                stdout.write(formatOutput(result.stdout || result.stderr || "\n"));
            } catch (error) {
                stdout.write(
                    formatError(`${error instanceof Error ? error.message : String(error)}\n`),
                );
            }
        }
    } finally {
        rl.close();
    }
}

module.exports = {
    startRepl,
};