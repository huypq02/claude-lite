function estimateTokens(input) {
    const text = String(input).trim();

    if (!text) {
        return 0;
    }

    return Math.ceil(text.length / 4);
}

module.exports = {
    estimateTokens,
};