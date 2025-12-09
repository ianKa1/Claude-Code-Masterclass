---
description: Create a commit message by analyzing git diffs
argument-hint: "[optional: additional context]"
allowed-tools: Bash
---

User input: `$ARGUMENTS`

Analyze git changes and create a commit message. Use present tense and explain "why" not just "what". If any user input is present, take that into account.

## Run these commands:

```bash
git status
git diff --staged
```

## Commit types with emojis:

- ✨ `feat:` - New feature
- 🐛 `fix:` - Bug fix
- 🔨 `refactor:` - Refactoring code
- 📝 `docs:` - Documentation
- 💄 `style:` - Styling/formatting
- ✅ `test:` - Tests
- ⚡ `perf:` - Performance

## Format:

```
<emoji> <type>: <concise description>

[Optional body explaining why]
```

## Output:

1. Show summary of changes
2. Propose commit message with appropriate emoji
3. Ask for confirmation before committing

DO NOT auto-commit - wait for user approval.
