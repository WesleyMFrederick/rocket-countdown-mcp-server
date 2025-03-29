# LLM REFERENCE GUIDE - READ THIS FIRST

## Project Overview: Rocket Countdown MCP Server

*   **Purpose:** Implements a Rocket Countdown MCP server (`rocket-countdown`).
*   **Tool:** Provides one tool: `continueCountdown`.
    *   Simulates a progressive countdown (10... 9... 8...).
    *   Input: `current_number` (0-10).
    *   Output: `next_number_to_count` until 0, then "Countdown complete!".
    *   Usage: LLM calls tool repeatedly with `next_number_to_count`.
*   **Transport:** Uses stdio for MCP communication.

## CRITICAL: Reading Order & Core File

1.  **THIS DOCUMENT** - Essential context, patterns, execution.
2.  **`./index.ts`** - **START HERE.** Core implementation details.
3.  **`./README.md`** - User-facing documentation & Changelog.
4.  **Other `llm_docs/` files** - As needed for specific topics (MCP overview, debugging).

## CRITICAL: Execution & Testing (MCP Protocol)

*   **Direct Execution:** Project runs directly from TypeScript using `npx`.
    ```bash
    # PRIMARY EXECUTION/TESTING PATTERN
    # Separates MCP JSON (stdout) from logs (stderr)
    npx index.ts 2> stderr.log > stdout.log 
    
    # Verify stdout contains ONLY valid MCP JSON messages
    cat stdout.log 
    
    # Check stderr for application logs/errors
    cat stderr.log 
    ```
*   **Command Line Access:** Use `execute_command` for direct testing, debugging, and verification.
*   **CRITICAL LOGGING PATTERN:** All non-protocol console output MUST use `console.error` to avoid breaking MCP JSON messages on `stdout`.
    ```typescript
    // INCORRECT - Breaks MCP protocol on stdout
    // console.log("Debugging message"); 
    
    // CORRECT - Preserves MCP protocol on stdout
    console.error("Debugging message"); 
    ```
*   **JSON Parsing Errors:** Errors like `SyntaxError: Unterminated fractional number in JSON` in `stdout.log` usually indicate incorrect logging (`console.log` instead of `console.error`).

## Available Tools (Current Session)

*   **`execute_command`**: Run shell commands (testing, building, file ops).
*   **`read_file`**: Examine file content (use this, not `cat`).
*   **`write_to_file`**: Create or overwrite files entirely.
*   **`replace_in_file`**: Make targeted edits using SEARCH/REPLACE blocks.
*   **`list_files`**: List directory contents.
*   **`search_files`**: Regex search across files.
*   **`list_code_definition_names`**: Get code structure overview.
*   **`use_mcp_tool`**: Call MCP tools (like `continueCountdown`).
*   **`ask_followup_question`**: Clarify requirements if needed.
*   **`attempt_completion`**: Finalize task.

## Documentation Sync Protocol

After significant code changes (especially tool add/remove/modify):

1.  **Update `README.md`**:
    *   Tools section.
    *   Changelog.
2.  **Update `llm_docs/0_llm_read_first.md`**:
    *   Project Overview / MCP SERVER SPECIFICS if tool definition changes.
    *   Execution/Testing commands if affected.
3.  **Update `llm_docs/3_debugging_mcp_servers.md`**:
    *   Testing commands/examples if affected.
4.  **Update `.clinerules`**: If new project-wide rules/patterns emerge.

## LLM-to-LLM Documentation Style Reference (`.clinerules`, `llm_docs/`)

*   **Objective:** Record critical info (rules, patterns, gotchas) efficiently for future LLMs. Optimize for context window.
*   **Style:** Extreme conciseness, information density, targeted detail, unambiguous, actionable, structured format (lists, code blocks, headings).
*   **Use Cases:**
    *   `.clinerules`: Short, project-wide rules (e.g., "Logging: Use `console.error` ONLY.").
    *   `llm_docs/`: Deeper technical notes, debugging steps, patterns (e.g., `z.preprocess` issue).

## Next Step: Analyze index.ts

Proceed to read and analyze `./index.ts` for implementation details.
