---
description: Create a feature spec file and suggested branch name from a short idea
argument-hint: "[short feature description, optionally 'figma: <component>']"
allowed-tools: Read, Write, Glob
---

You are helping to spin up a new feature spec for this application, from a short idea. Always adhere to any rules or requirements set out in any CLAUDE.md files when responding.

User input (raw arguments): `$ARGUMENTS`

## High level behavior

Turn the user input into:

- A human friendly feature title (e.g. new-heist-form)
- A safe git branch name  (e.g. claude/feature/new-heist-form)
- A detailed markdown spec file under the specs/ directory  
- Optional Figma design notes if a figma component is mentioned

Then save the spec file to disk and print a short summary of what you did.

## Step 1. Check the current branch

Check the current Git branch, and abort this entire process if there are any uncomitted, unstaged, or untracked files in the working directory. Tell the user to commit or stash changes before proceeding, and DO NOT GO ANY FURTHER.

## Step 2. Parse the arguments

From `$ARGUMENTS`, extract:

1. `feature_title`  
   - A short, human readable title in Title Case.  
   - Example: "Card Component for Dashboard Stats".

2. `feature_slug`  
   - A git safe slug.  
   - Rules:  
     - Lowercase  
     - Only `a-z`, `0-9` and `-`  
     - Replace spaces and punctuation with `-`  
     - Collapse multiple `-` into one  
     - Trim `-` from start and end  
     - Maximum length 40 characters  
   - Example: `card-component` or `card-component-dashboard`.

3. `branch_name`  
   - Format: `claude/feature/<feature_slug>`  
   - Example: `claude/feature/card-component`.

4. `figma_hint` (optional)  
   - If `$ARGUMENTS` contains the substring `figma:`  
   - Then everything after `figma:` is the figma component, description or id.  
   - Trim whitespace.  
   - Example input:  
     - `/spec Card component figma: Dashboard / StatCard`  
     - `figma_hint` becomes `"Dashboard / StatCard"`.

If you cannot infer a sensible `feature_title` and `feature_slug`, ask the user to clarify instead of guessing.

## Step 2. Pull Figma context when needed

If `figma_hint` is present and Figma MCP tools are available:

1. Use the Figma MCP tools to locate the best matching component or frame.  
2. Extract only information that is useful for implementation, such as:  
   - Dimensions and layout (grid, spacing, alignment)  
   - Key typography tokens (font family, size, weight)  
   - Color tokens and semantic usage (primary, surface, border, error etc.)  
   - Border radius, shadows, and any notable visual detail
   - Icons, buttons, links or other UI elements
3. Summarise this as 3 to 8 concise bullet points and also leave a reference to the figma file/component for future lookups. 
4. If lookup fails or the tools are not available, record a note like:  
   - `"Design reference could not be retrieved. See Figma manually for details."`

Do not paste huge raw JSON. Always summarise into human friendly notes.

## Step 3. Switch to a new Git branch

Before making any content, switch to a new Git branch using the `branch_name` derived from the `$ARGUMENTS`. If the branch name is already taken, then append a version number to it: e.g. `claude/feature/card-component-01`

## Step 4. Draft the spec content

Create a markdown spec document that Plan mode can use directly and save it in the _specs folder using the `feature_slug`. Use the exact structure as defined in the spec template file here: @_specs/template.md. Include the main test cases.

## Step 5. Final output to the user

After the file is saved, respond to the user with a short summary in this exact format:

    Branch: <branch_name>
    Spec file: specs/<feature_slug>.md
    Title: <feature_title>

Do not repeat the full spec in the chat output unless the user explicitly asks to see it.
The main goal is to save the spec file and report where it lives and what branch name to use.