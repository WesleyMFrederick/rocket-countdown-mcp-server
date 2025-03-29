# MCP Server Debugging and Testing Guide for LLMs

## IMPORTANT: This document is designed for LLM assistants to help debug MCP servers

When debugging Model Context Protocol (MCP) servers, use these direct testing approaches to efficiently identify and resolve problems:

## Stdio Transport Issues

1. CRITICAL: MCP over stdio requires strict channel separation:
   - stdout: ONLY for JSON protocol messages
   - stderr: for all logging, user messages, and application output
   - Any non-JSON output to stdout breaks the protocol

2. Direct testing to diagnose stdio issues:
```bash
# Run server with output separation for analysis
node index.js 2> stderr.log > stdout.log

# In another terminal, examine the output
cat stdout.log  # Should ONLY contain valid JSON messages
cat stderr.log  # Should contain all console output

# Alternatively, monitor in real-time
tail -f stdout.log
tail -f stderr.log
```

3. Common error signatures to identify:
```
Error from MCP server: SyntaxError: Unterminated fractional number in JSON at position 2 (line 1 column 3)
```
or
```
Error from MCP server: Unexpected token 'B', "BLAST OFF!" is not valid JSON
```

4. Code fix pattern:
```typescript
// INCORRECT - breaks MCP protocol:
console.log("Countdown: 3...");

// CORRECT - preserves protocol integrity:
console.error("Countdown: 3...");
```

5. Required changes for ALL console output:
```typescript
// Server startup messages
if (!isInspector) {
  console.error("Starting Rocket Countdown MCP Server with stdio transport...");
}

// Runtime messages
console.error(`${countdownValue}...`);

// Exception handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Don't exit process - would terminate MCP connection
});
```

## Testing Methods (in order of preference)

1. Direct CLI testing - most efficient for quick verification:
```bash
# Start server with output redirection
node index.js 2> stderr.log > stdout.log

# In another terminal, examine logs in real-time
tail -f stdout.log
tail -f stderr.log

# Verify stdout contains ONLY valid JSON
python3 -c "import json; json.loads(open('stdout.log').read())"
```

2. MCP Inspector testing - best for full protocol validation:
```bash
# Build the project first
npm run build

# Run inspector in background
screen -d -m npm run inspect

# Or with logs for analysis
npm run inspect > inspector.log 2>&1 &

# Test specific tools via curl (when Inspector running)
curl -X POST http://localhost:3000/api/tools/get-countdown-status \
  -H "Content-Type: application/json" \
  -d '{}'
```

3. Port conflict resolution (when needed):
```bash
# Find processes using ports
lsof -i :5173
lsof -i :3000

# Terminate processes
kill -9 PID
```

## Implementation Strategy

1. Directly test with separated stdout/stderr to diagnose
2. Modify code: replace ALL console.log with console.error
3. Add error handlers to prevent unexpected stdout writes
4. Verify with direct testing and/or MCP Inspector
5. Monitor both stdout and stderr during testing

## REMINDER: When assisting users with MCP servers

1. First run output separation test to confirm issue
2. Replace ALL console.log with console.error
3. Add uncaught exception handlers
4. Verify with direct testing via command line
5. Confirm with MCP Inspector for full protocol validation

Direct CLI testing combined with MCP Inspector validation will resolve approximately 90% of MCP stdio transport issues.
