// Rough estimate. ~4 chars per token for English prose.
// Inaccurate for code, numbers, and CJK. Always show "~" prefix in UI.
export function estimateTokens(text) {
    return Math.ceil((text || "").length / 4);
}

export function percentSaved(before, after) {
    if (before <= 0) return 0;
    return Math.round(((before - after) / before) * 100);
}