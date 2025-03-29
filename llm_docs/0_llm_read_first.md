# LLM REFERENCE GUIDE - READ THIS FIRST

## YOU HAVE COMMAND LINE ACCESS - USE IT

As an LLM assistant, you have FULL COMMAND LINE ACCESS via the `BashCommand` tool. Use this capability for direct testing, debugging, and verification. NEVER state or imply that you lack command-line access.

```bash
# CORRECT TESTING PATTERN (Assumes index.js exists, e.g., after `npm run build`)
node index.js 2> stderr.log > stdout.log
cat stdout.log  # Verify only JSON protocol messages

# ALTERNATIVE (using ts-node via npm start, if configured)
# (Requires inspecting package.json's start script)
# npm start 2> stderr.log > stdout.log 
```

## READING SEQUENCE - FOLLOW THIS ORDER

1. **THIS DOCUMENT** - Essential tools and patterns
2. **index.ts** in root directory - Core implementation details
   ```
   READ THIS FILE NEXT: ./index.ts 
   ```
3. **README.md** in root directory - User-facing documentation & Changelog
4. **Other llm_docs files** as needed - Focused reference material

## TOOLS AT YOUR DISPOSAL

1. **BashCommand** - Run shell commands directly
   ```
   npm commands, file inspection, building, testing
   ```

2. **ReadFiles** - Examine file content
   ```
   ALWAYS use this for file content, not cat/grep
   ```

3. **FileWriteOrEdit** - Modify files
   ```
   Update code using search/replace blocks
   ```

## PATTERN MATCHING FOR MCP DEBUGGING

1. **Key Error Pattern**: JSON parsing errors in stdout
   ```
   Error: SyntaxError: Unterminated fractional number in JSON
   ```

2. **Root Cause Pattern**: Console logging to stdout
   ```typescript
   // INCORRECT PATTERN - breaks MCP protocol
   console.log("Message");  
   
   // CORRECT PATTERN - preserves protocol
   console.error("Message");
   ```

3. **Testing Pattern**: Separate stdout/stderr
   ```bash
   # Direct testing pattern (Assumes index.js exists, e.g., after `npm run build`)
   node index.js 2> stderr.log > stdout.log
   cat stdout.log  # Should ONLY contain valid JSON
   ```

## CONTEXT MANAGEMENT

1. **Focus first** on index.ts to understand core implementation
2. **Pattern match** against known MCP issues (stderr/stdout separation)
3. **Use CLI** for direct testing and verification
4. **Access documentation** selectively based on need
5. **DOC SYNC**: After significant code changes (esp. tool add/remove/modify), update: 
   - `README.md` (Tools section & Changelog)
   - `llm_docs/0_llm_read_first.md` (MCP SERVER SPECIFICS)
   - `llm_docs/3_debugging_mcp_servers.md` (Testing commands/examples if affected)

## LLM-to-LLM Documentation Style (`.clinerules`, `llm_docs/`)

**Objective:** Record critical information (rules, patterns, gotchas, essential context) for future LLM instances efficiently. Optimize for LLM processing and context window limits.

**Style Guidelines:**

*   **Extreme Conciseness:** Use minimal wording. Eliminate filler and redundant phrases. Focus on keywords and essential facts.
*   **Information Density:** Pack maximum relevant information into minimum tokens.
*   **Targeted Detail:** Provide *only* the breadth, depth, and level of detail necessary for a future LLM to understand the specific point or perform the required action. Avoid unnecessary background or explanation. Assume the reader is an LLM with access to the codebase and prior documentation.
*   **Unambiguous & Precise:** Use exact technical terms. Avoid subjective or vague language. State facts and instructions clearly.
*   **Actionable:** Frame notes as direct rules, critical facts, or patterns that directly inform future LLM actions or prevent errors.
*   **Structured Format:** Use lists, code blocks (for commands/examples), and clear headings (`##`, `###`) for rapid parsing by an LLM.

**Example Application:**
    *   `.clinerules`: Short, project-wide rules/preferences (e.g., "MCP Logging: Use `console.error` ONLY.").
    *   `llm_docs/`: Deeper technical notes, specific debugging steps, architectural summaries, critical patterns (e.g., the `z.preprocess` issue explanation). Organize logically within relevant files (e.g., `3_debugging_mcp_servers.md`).

## MCP SERVER SPECIFICS

This project implements a Rocket Countdown MCP server (`rocket-countdown`) that:
1. Provides one tool: `continueCountdown`
   - Simulates a progressive countdown (e.g., 10... 9... 8...)
   - Takes `current_number` (0-10) as input.
   - Returns `next_number_to_count` until 0, then "Countdown complete!".
   - LLM calls tool repeatedly with `next_number_to_count`.
2. Uses stdio transport for communication.
3. Needs strict stdout/stderr separation for protocol integrity.

**CRITICAL IMPLEMENTATION PATTERN**: All console output MUST use stderr (`console.error`) to avoid breaking the MCP protocol JSON messages on stdout.

## BEGIN YOUR ANALYSIS WITH index.ts NEXT
