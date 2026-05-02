function cleanPrompt(input) {
    return String(input)
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, "  ")
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trim();
}

module.exports = {
    cleanPrompt,
};