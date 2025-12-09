---
name: mock-data-generator
description: Generates mock data in ./mocks/db.json format for use with json-server. Use this skill when: (1) Testing features that need dummy data, (2) Creating new API endpoints for a data type (e.g., "create an endpoint for blog posts"), (3) Any scenario requiring mock/test data for development. Automatically looks for TypeScript types in ./types/ folder to structure the data, creates missing folders/files, and limits each resource to 20 items.
---

# Mock Data Generator

## Overview

This skill generates realistic mock data in `./mocks/db.json` format for use with json-server. It automatically discovers TypeScript types, creates necessary folders and files, and populates the database with appropriate test data.

## Workflow

When this skill is triggered, follow these steps:

### 1. Check and Create Required Files

**Check for `./mocks` directory:**
- If it doesn't exist, create it
- If `./mocks/db.json` doesn't exist, create it with an empty JSON object: `{}`

### 2. Identify the Data Type Needed

Determine what type of data needs to be generated based on the user's request.

Examples:
- "Create an endpoint for blog posts" → Look for `Post`, `BlogPost`, or similar type
- "I need some user data" → Look for `User` type
- "Test the products feature" → Look for `Product` type

### 3. Look for TypeScript Types

Search the `./types/` directory for relevant TypeScript type definitions or interfaces.

**Search strategy:**
1. Look for exact matches first (e.g., `User` type for user data)
2. Look for similar names (e.g., `BlogPost` or `Post` for blog posts)
3. Check `types/index.ts` for exported types

**When a type is found:**
- Use all properties defined in the type
- Respect optional properties (marked with `?`) - include them sometimes but not always
- Match the data types (string, number, boolean, arrays, nested objects)
- For union types, pick reasonable values

**When no type is found:**
- Use best judgment for common data structures
- Include typical fields (id, name, createdAt, etc.)
- Make reasonable assumptions based on the data type name

### 4. Generate Mock Data

Create realistic, contextually appropriate mock data:

**General guidelines:**
- Generate between 5-20 items per resource (never exceed 20)
- Use realistic values that make sense for the data type
- Include variety in the data (different values, not all the same)
- For IDs: use incremental integers (1, 2, 3...) or UUIDs
- For dates: use ISO 8601 format strings
- For arrays: include 0-5 items per array field
- For booleans: mix true and false values
- For nested objects: populate all fields

**Examples of realistic data:**

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "role": "user",
      "createdAt": "2024-02-20T14:45:00Z"
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with Next.js",
      "content": "Next.js is a powerful React framework...",
      "authorId": 1,
      "published": true,
      "tags": ["nextjs", "react", "tutorial"],
      "createdAt": "2024-03-10T09:00:00Z"
    }
  ]
}
```

### 5. Update db.json

**For new resources:**
- Add the resource as a new top-level key in the JSON object
- Use plural form for the key name (e.g., `users`, `posts`, `products`)

**For existing resources:**
- Append new items to the existing array
- Ensure IDs don't conflict with existing items
- Still respect the 20-item maximum (if adding would exceed 20, replace old data or trim)

**Important:**
- Maintain valid JSON format
- Use 2-space indentation for readability
- Ensure the file ends with a newline

### 6. Confirm Completion

Inform the user that mock data has been generated and provide:
- Location of the file (`./mocks/db.json`)
- What resources were added/updated
- How many items were generated
- Brief reminder that json-server can now serve this data

## Common Patterns

**Creating multiple related resources:**

When generating data for related resources (e.g., users and their posts), ensure referential integrity:

```json
{
  "users": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "posts": [
    { "id": 1, "authorId": 1, "title": "Alice's Post" },
    { "id": 2, "authorId": 2, "title": "Bob's Post" }
  ]
}
```

**Handling unknown types:**

If no type definition exists AND the data type is unclear, ask the user what fields the resource should have, or use common sense defaults:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Item 1",
      "description": "Description for item 1",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Notes

- This skill does NOT include json-server setup instructions - assume json-server is already configured
- Focus on generating reasonable, realistic data rather than using libraries like faker.js
- Always respect the 20-item maximum per resource type
- Keep data contextually appropriate to the application domain
