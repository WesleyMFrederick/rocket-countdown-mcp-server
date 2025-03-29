# MCP Server Debugging Techniques

This guide provides specific techniques for debugging MCP servers, assuming familiarity with the core concepts in `llm_docs/0_llm_read_first.md`.

## Stdio Transport Debugging

*   **Core Issue Reminder:** MCP over stdio requires strict separation: `stdout` for JSON protocol messages ONLY, `stderr` for all logs/errors. Any non-JSON to `stdout` breaks the protocol. Use `console.error` for all logging. See `0_llm_read_first.md` for the primary execution pattern.
*   **Common Error Signatures:** JSON parsing errors in `stdout` (e.g., `SyntaxError: Unterminated fractional number`, `Unexpected token ... is not valid JSON`) usually indicate `console.log` was used instead of `console.error`.

## Testing & Verification Methods

1.  **Direct CLI Testing (Primary):**
    ```bash
    # Run directly from TS, separating outputs
    npx index.ts 2> stderr.log > stdout.log 
    
    # Monitor logs in real-time (separate terminals)
    tail -f stdout.log
    tail -f stderr.log
    
    # Validate stdout contains ONLY valid JSON
    # (Press Ctrl+D after server sends messages or stop server)
    python3 -c "import json, sys; [json.loads(line) for line in sys.stdin]" < stdout.log
    ```

2.  **Direct CLI Testing (Compiled JS - Secondary):**
    ```bash
    # Requires build step first
    npm run build && node index.js 2> stderr.log > stdout.log
    # Then use tail -f / python3 validation as above
    ```

3.  **MCP Inspector Testing:**
    *   Useful for full protocol validation, requires compiled JS.
    ```bash
    # Build first
    npm run build
    
    # Run inspector (foreground recommended)
    npm run inspect
    # Or log output
    # npm run inspect > inspector.log 2>&1 & 
    ```
    *   Use `curl` or Inspector UI to call tools if applicable (check Inspector docs for endpoints/usage).

4.  **Port Conflict Resolution:**
    ```bash
    # Find processes using a port (e.g., 5173 for Inspector)
    lsof -i :5173
    
    # Terminate conflicting process
    kill -9 <PID> 
    ```

## Schema Preprocessing Issues (`z.preprocess`)

1.  **Problem**: Using `z.preprocess` within a tool's input schema (`server.tool(...)`) can execute during server registration *before* the tool is called.
2.  **Symptom**: Debug messages showing `undefined` input during startup; tool fails to appear in MCP clients (Cline, Inspector).
3.  **Cause**: Preprocessing runs in registration context without actual input arguments.
4.  **Solution**:
    *   **Remove `z.preprocess`** from the schema definition (`server.tool(...)`).
    *   Define schema directly (e.g., `z.number()`).
    *   **Move input conversion/validation** logic *inside* the tool's handler function (`async (args, _extra) => { ... }`).

## Debugging Checklist

1.  Verify all logging uses `console.error`.
2.  Test with direct CLI execution, separating `stdout`/`stderr`.
3.  Monitor `stdout`/`stderr` in real-time (`tail -f`).
4.  Validate `stdout` contains only JSON (`python3 -c ...`).
5.  Use MCP Inspector for deeper protocol checks (requires build).
6.  Check for `z.preprocess` issues in tool schemas if tools aren't listed.
7.  Check for port conflicts if Inspector or other services fail to start.
