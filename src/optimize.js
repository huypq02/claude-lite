// Pure function. No I/O. Easy to test by hand.
const FILLERS = [
    /\bplease\b/gi,
    /\bkindly\b/gi,
    /\bin detail\b/gi,
];

const CONSTRAINT = "\n\nAnswer concisely. Max 100 words.";

export function optimizePrompt(prompt) {
    let out = prompt;
    for (const re of FILLERS) out = out.replace(re, "");
    out = out.replace(/\s+/g, " ").trim();
    if (!out) return out;          // don't append constraint to empty input
    return out + CONSTRAINT;
}