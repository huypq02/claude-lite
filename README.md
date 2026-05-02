# claude-lite

Minimal Node.js scaffold for a lightweight Claude CLI wrapper.

## Structure

- `bin/cli.js`: executable entry point
- `src/optimize.js`: prompt cleanup helpers
- `src/tokens.js`: token estimation helpers
- `src/claude.js`: Claude CLI process wrapper
- `src/repl.js`: interactive loop
- `src/ui.js`: terminal formatting helpers

## Setup

```bash
mkdir claude-lite && cd claude-lite
# create files above
npm install
chmod +x bin/cli.js
npm link              # makes `claude-lite` global on your machine
claude-lite           # start chatting
claude-lite --debug   # see prompt before/after
```

Sanity check the `claude` CLI works on its own first:

```bash
claude -p "say hi"
```

If that fails, `claude-lite` will fail too — fix auth first.

## Test prompts

Run these in order. Each tests something specific.

| #   | Prompt                                         | Tests                                               |
| --- | ---------------------------------------------- | --------------------------------------------------- |
| 1   | `Please explain what a hash map is`            | Filler removal ("please")                           |
| 2   | `Kindly tell me, in detail, how DNS works`     | Multi-filler removal + constraint pushback          |
| 3   | `What is 2+2?`                                 | Short prompt edge case (no fillers to remove)       |
| 4   | _(empty enter)_                                | Empty-input handling                                |
| 5   | `exit`                                         | Clean exit                                          |
| 6   | `Explain "this" with backticks \`` and $HOME`` | Injection safety — must NOT be interpreted by shell |
| 7   | Ctrl+C mid-prompt                              | Signal handling                                     |

**Honest expectations on savings:**

Prompt 1: input goes from ~9 → ~14 tokens after constraint is appended. Negative on input alone.
The win shows up in output length — Claude obeys "Max 100 words". This MVP doesn't measure output savings yet.

## Risks + quick fixes

| Risk                                     | Why it matters                                          | Fix today                                                         |
| ---------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Command injection                        | Prompt could contain shell metacharacters               | Already mitigated: `execa("claude", [array])` never invokes shell |
| Math is misleading                       | "% saved" only counts input chars, ignores output       | Labelled as "input estimate" — add output measurement day 2       |
| No conversation memory                   | Follow-up "and the second one?" — Claude has no context | Banner says "each message is independent". Memory is day 2        |
| Hangs if Claude CLI hangs                | User stuck staring at terminal                          | 60 s timeout already in `callClaude`                              |
| Ctrl+C during Claude call                | Child process keeps running                             | execa kills child when parent exits; Node default is fine for MVP |
| Stripping "in detail" changes intent     | User wanted depth, you removed it AND added "concise"   | Document. Add `--no-optimize` day 2 if users complain             |
| chars/4 lies on code/CJK                 | Reported savings are wrong for those inputs             | Always print `~` and `(estimate)`. Don't pretend precision        |
| Piped stdin (`echo "hi" \| claude-lite`) | Loop exits after first line — confusing                 | Acceptable for MVP; interactive mode expects a TTY                |
