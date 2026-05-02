const { spawn } = require("node:child_process");

function runClaude(prompt, options = {}) {
    const claudeCommand = options.command || "claude";
    const args = options.args || [];

    return new Promise((resolve, reject) => {
        const child = spawn(claudeCommand, args, {
            stdio: ["pipe", "pipe", "pipe"],
            shell: process.platform === "win32",
        });

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("error", reject);

        child.on("close", (code) => {
            if (code === 0) {
                resolve({ stdout, stderr, code });
                return;
            }

            reject(new Error(stderr || `claude exited with code ${code}`));
        });

        child.stdin.write(String(prompt));
        child.stdin.end();
    });
}

module.exports = {
    runClaude,
};