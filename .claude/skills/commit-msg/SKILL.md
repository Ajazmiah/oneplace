---
name: commit-msg
description: Generate a commit message from the staged diff and commit with it. Use when the user says "write a commit message", "generate a commit", "commit my changes", or runs /commit-msg.
---

# Commit message workflow

1. Run `git diff --staged`. If it's empty, stop and tell the user there's nothing staged — ask them to `git add` the files they want committed first. Do not proceed further.
2. Read the staged diff to understand what changed and why.
3. Generate a commit message in this exact format:

   ```
   type(scope): short subject

   - bullet of what changed
   - bullet of why
   ```

   - `type` is one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
   - `scope` is the affected area (e.g. a package, app, or module name) — infer it from the diff's file paths.
   - `subject` is under 60 characters, imperative mood, no trailing period.
   - Body bullets are optional but encouraged — include them when there's something non-obvious worth noting (what changed, and why it changed). Skip bullets that just restate the subject.
   - Never include a `Co-Authored-By` trailer or any other trailer.

4. Run `git commit -m "<message>"` with that message (use a `HEREDOC` so multi-line bodies stay formatted correctly).
5. Confirm the commit succeeded (e.g. show the resulting `git log -1 --oneline` or the commit hash).
