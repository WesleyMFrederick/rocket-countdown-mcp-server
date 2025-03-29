# LLM REFERENCE GUIDE - READ THIS FIRST

## YOU HAVE COMMAND LINE ACCESS - USE IT

As an LLM assistant, you have FULL COMMAND LINE ACCESS via the `BashCommand` tool. Use this capability for direct testing, debugging, and verification. NEVER state or imply that you lack command-line access.

```bash
# CORRECT TESTING PATTERN
node index.js 2> stderr.log > stdout.log
cat stdout.log  # Verify only JSON protocol messages
```

## READING SEQUENCE - FOLLOW THIS ORDER

1. **THIS DOCUMENT** - Essential tools and patterns
2. **index.ts** in root directory - Implementation details
   ```
   READ THIS FILE NEXT: /Users/wesleyfrederick/Documents/Obsidian Vault/0_SoftwareDevelopment/MCP/LLM Product Thinking/index.ts
   ```
3. **README.md** in root directory - User-facing documentation
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
   # Direct testing pattern
   node index.js 2> stderr.log > stdout.log
   cat stdout.log  # Should ONLY contain valid JSON
   ```

## CONTEXT MANAGEMENT

1. **Focus first** on index.ts to understand core implementation
2. **Pattern match** against known MCP issues (stderr/stdout separation)
3. **Use CLI** for direct testing and verification
4. **Access documentation** selectively based on need

## MCP SERVER SPECIFICS

This project implements a Rocket Countdown MCP server that:
1. Provides countdown tools (start, stop, reset, status)
2. Uses stdio transport for communication
3. Needs strict stdout/stderr separation for protocol integrity

**CRITICAL IMPLEMENTATION PATTERN**: All console output MUST use stderr (console.error) to avoid breaking the MCP protocol JSON messages on stdout.

## BEGIN YOUR ANALYSIS WITH index.ts NEXT