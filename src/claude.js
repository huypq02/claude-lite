import { execa } from "execa";

// CRITICAL: pass args as ARRAY, never as a shell string.
// execa("claude", [...]) does NOT use a shell, so prompts with quotes,
// backticks, $VARS are safe.
export async function callClaude(prompt, { timeoutMs = 60_000 } = {}) {
    try {
        const { stdout } = await execa("claude", ["-p", prompt], {
            timeout: timeoutMs,
        });
        return stdout.trim();
    } catch (err) {
        if (err.code === "ENOENT") {
            throw new Error(
                "Claude CLI not found. Install it from https://docs.claude.com/claude-code"
            );
        }
        if (err.timedOut) {
            throw new Error(`Claude timed out after ${timeoutMs / 1000}s.`);
        }
        throw new Error(`Claude failed: ${err.shortMessage || err.message}`);
    }
}