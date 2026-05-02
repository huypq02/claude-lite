import chalk from "chalk";

export const ui = {
    banner: () => {
        console.log(chalk.bold.cyan("\nclaude-lite") + chalk.dim("  v0.1.0"));
        console.log(chalk.dim("Type your message. 'exit' or Ctrl+C to quit.\n"));
    },
    user: () => chalk.green("you ▸ "),
    assistantLabel: () => chalk.cyan("claude ▸"),
    status: (msg) => chalk.dim("⚡ " + msg),
    error: (msg) => chalk.red("✖ " + msg),
    report: ({ origT, optT, saved, cached }) => {
        const parts = [
            `~${origT} → ~${optT} tokens`,
            saved > 0 ? `${saved}% saved` : `${saved}%`,
        ];
        if (cached) parts.push("cache HIT");
        return chalk.dim("  " + parts.join("  •  ") + "  (estimate)");
    },
    debug: (orig, opt) => {
        console.log(chalk.yellow("\n[debug] original:"));
        console.log(chalk.dim(orig));
        console.log(chalk.yellow("[debug] optimized:"));
        console.log(chalk.dim(opt) + "\n");
    },
};