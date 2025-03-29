# Rocket Countdown MCP Server

A Model Context Protocol (MCP) server that implements a rocket countdown timer. It allows users to start, stop, and reset a countdown, and displays "BLAST OFF!" when the countdown reaches zero.

## Features

- Start a countdown from 10 to 1, followed by "BLAST OFF!"

## Tools

The server exposes the following tool:

1.  `continueCountdown`: Simulates a rocket countdown by progressively counting down numbers.
    *   **Input**: `current_number` (integer, 0-10).
    *   **Action**: Outputs the `current_number` to stderr (e.g., "10..."), waits 1 second.
    *   **Output**: Returns JSON with `next_number_to_count` (which is `current_number - 1`) and `is_final` boolean. If `current_number` is 0, outputs "BLAST OFF!" to stderr and returns "Countdown complete!".
    *   **Usage**: The client (LLM) needs to call this tool repeatedly, passing the `next_number_to_count` received from the previous call as the `current_number` for the next call, starting with an initial value (e.g., 10) and continuing until the response indicates completion or `next_number_to_count` is less than 0.

## Tool Definition Approach

This project uses the `@modelcontextprotocol/sdk`'s `server.tool()` helper method along with the `zod` library to define the input schema for the `continueCountdown` tool (see `index.ts`). This provides a developer-friendly way to define schemas with type safety in TypeScript.

It's important to note that this SDK-specific approach is an abstraction. Internally, the SDK converts the `zod` schema into the standard JSON Schema format required by the Model Context Protocol specification before exposing the tool definition to clients. The raw protocol definition structure is documented in the general MCP documentation (see `llm_docs/1_mcp_overview.md` under the "Tools" concept).

## Setup

1. Make sure you have Node.js installed (v16 or higher recommended)
2. Clone this repository
3. Install dependencies:

```bash
npm install
```

4. Start the server in development mode:

```bash
npm start
```

This will run the TypeScript file directly using ts-node without needing to compile to JavaScript first.

5. For testing with the MCP Inspector (requires compilation):

```bash
npm run inspect
```

This will compile the TypeScript file to JavaScript and then start the MCP Inspector, providing a web interface to interact with your MCP server.

### Troubleshooting

#### MCP Inspector Errors

When using the MCP Inspector, you might encounter these common errors:

1. **JSON Parsing Errors**: The MCP protocol requires clean communication channels with only JSON messages on stdout. If you see errors like `SyntaxError: Unterminated fractional number in JSON` or `Unexpected token 'B', "BLAST OFF!" is not valid JSON`, it's because console output is interfering with MCP messages.

   - **Solution**: This server uses `console.error()` instead of `console.log()` for all user-facing output, which directs messages to stderr instead of stdout, leaving stdout clean for MCP communication. This is a critical design choice for MCP servers using stdio transport.

   - **How it works**: The countdown numbers (10, 9, 8, etc.) and "BLAST OFF!" message are sent to stderr, while the JSON-formatted MCP protocol messages are sent to stdout. This separation prevents corruption of the protocol stream.
   
   - **Technical Details**: All `console.log()` statements in the countdown interval and server startup have been replaced with `console.error()` calls, and an uncaught exception handler has been added to prevent any unexpected outputs to stdout.

2. **Ports Already in Use**: When running the MCP Inspector, you might see errors about ports already in use:

   ```
   Error: listen EADDRINUSE: address already in use :::5173
   Error: listen EADDRINUSE: address already in use :::3000
   ```

   - **Solution**: Find and terminate the processes using those ports:
   
   ```bash
   lsof -i :5173  # Find process using port 5173
   lsof -i :3000  # Find process using port 3000
   kill -9 PID    # Kill the process using its PID
   ```

3. **Tool Not Listed / "Preprocessing input: undefined" Error**: If the MCP server connects but doesn't list its tools (e.g., `continueCountdown` is missing) and you see a debug message like `Debug: Preprocessing input: undefined, type: undefined` in the MCP panel status for the server, it might be due to schema preprocessing.

   - **Cause**: Using `z.preprocess` within a tool's input schema definition (`server.tool(...)`) can sometimes cause the preprocessing function to execute during the server's startup/registration phase, before any client has actually called the tool. In this context, the input value is `undefined`, leading to the debug message and potentially interfering with the tool registration process.
   - **Solution**: Remove the `z.preprocess` wrapper from the schema definition. Move the input conversion (e.g., `Number(val)`) and validation logic *inside* the main tool handler function (`async (args, _extra) => { ... }`). This ensures the logic only runs when the tool is actually called with data.





#### Advanced Testing

For more advanced debugging and testing techniques, see the `llm_docs/debugging_mcp_servers.md` file, which provides:

- Systematic approaches to testing MCP servers
- Techniques for diagnosing JSON parsing errors
- Best practices for MCP server development
- Methods for background testing with screen

## Project Structure

- `index.ts`: The TypeScript source code
- `package.json`: Project configuration and dependencies
- `tsconfig.json`: TypeScript configuration
- `llm_docs/`: Documentation about MCP
- `.gitignore`: Specifies intentionally untracked files that Git should ignore

## How to Connect

This MCP server uses stdio for communication, so it can be connected to any MCP client that supports the stdio transport.

## Using with Claude Desktop in a local repository

Claude Desktop fully supports MCP and can connect to this server. To use with Claude Desktop:

1. Download and install [Claude Desktop](https://claude.ai/download) if you haven't already
2. Open Claude Desktop
3. Go to Claude > Settings
4. Click on Developer in left sidebar
5. Click "Edit Config"
6. Edit claude_desktop_config.json in a text editor
7. Enter the following details:
  ``` json
{
  "mcpServers": {
    "rocket-countdown": {
      "command": "/opt/homebrew/bin/npx",
      "args": [
        "-y",
        "absolute/path/to/working/directory"
      ]
    }
  }
}
  ```
  - **Environment Issues**: If you encounter issues with the MCP server in Claude Desktop, it may be because the app is using `spawn ${command} ${arguments}`, meaning it's starting a new process directly without the context of your shell environment (which contains your path, nvm settings, etc.).

  - **Solution**: You can solve this by pointing to the npx command using an absolute path. using bash as an intermediary:


## Using with MCP Inspector

For testing and development, you can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which provides a web interface to test your MCP server.

To use the inspector with this project, you can simply run:

```bash
npm run inspect
```

This is the easiest approach, as it handles both compiling the TypeScript file and starting the inspector.

Alternatively, you can do it manually in two steps. Note that `index.js` is not present by default after the cleanup, so you must build it first:

```bash
# 1. Build the JavaScript output (if not already present)
npm run build

# 2. Run the inspector with the compiled file
npx @modelcontextprotocol/inspector node index.js
```

This will start the MCP Inspector on a local web server, typically at http://localhost:5173, allowing you to interact with your MCP server through a user-friendly interface.

You may see errors in the console such as:
```
Error from MCP server: SyntaxError: Unexpected token 'S', "Starting R"... is not valid JSON
Error from MCP server: SyntaxError: Unexpected token 'R', "Rocket Cou"... is not valid JSON
```

These errors occur because the server outputs console logs that the MCP Inspector tries to parse as JSON. Despite these errors, the Inspector should still work correctly. The initial console logs are not part of the MCP protocol, so they generate these parsing errors, but once the server is fully initialized, communication should proceed normally.

> **Note:** The inspector requires a compiled JavaScript file and cannot directly use the TypeScript source. This is because the inspector uses the stdio transport to communicate with your server, and this requires properly formatted JSON messages which the standard console logs in the TypeScript file would interfere with.

## Example Usage

After connecting to the server through an MCP client:

1. Call the `continueCountdown` tool to begin the countdown
2. The server will output each number in the countdown
3. When the countdown reaches 0, it will output "BLAST OFF!"


### Using the Countdown in Claude Desktop

Once you've set up the server in Claude Desktop using one of the methods described above:

1.  Start a new chat with Claude.
2.  Tell Claude to start the countdown using the connected MCP server. For example: "Use the Rocket Countdown server to start a countdown from 10."
3.  Claude should recognize the request and invoke the `continueCountdown` tool with `current_number: 10`.
4.  You will be prompted to approve the tool use. Click "Approve".
5.  The server will output "10..." to its logs (viewable via Claude Desktop settings -> Developer -> View Logs) and return the next number (9) to Claude.
6.  Claude should then automatically call `continueCountdown` again with `current_number: 9`.
7.  Continue approving each subsequent tool call prompted by Claude.
8.  When the countdown reaches 0, the server outputs "BLAST OFF!" to its logs, and Claude should report that the countdown is complete.

**Note:** This tool requires repeated calls and approvals. The countdown progress (`10...`, `9...`, etc.) and the final "BLAST OFF!" message appear in the server's logs, not directly in the chat window. The chat will primarily show Claude requesting approval for each step.

## License

MIT

## Changelog

### 2025-03-29 (v1.0.2)
- **Documentation Cleanup**:
  - Updated `llm_docs/0_llm_read_first.md` and `llm_docs/3_debugging_mcp_servers.md` to accurately reflect the current single `continueCountdown` tool.
  - Corrected file paths and testing commands in LLM documentation.
  - Added explicit documentation synchronization guidelines to `llm_docs/0_llm_read_first.md`.
  - Ensured LLM docs adhere to the LLM-to-LLM style guide.
- **Project Cleanup**:
  - Removed compiled JS files (`index.js`, `index.js.map`) as the project runs via `npx` / `ts-node`.
  - Added `.gitignore` file with standard Node.js ignores.
  - Updated `README.md` project structure and MCP Inspector instructions.
  - Updated `.clinerules` with project execution info and `.gitignore` details.

### 2025-03-28 (v1.0.1)
- **Fixed JSON parsing errors** in MCP Inspector:
  - Replaced all `console.log()` calls with `console.error()` to redirect output to stderr
  - Modified countdown timer output to use stderr instead of stdout
  - Ensured server startup messages don't interfere with protocol messages
- **Enhanced error handling**:
  - Added global uncaught exception handler to prevent process termination
  - Implemented proper error isolation to avoid corrupting stdout JSON protocol
- **Improved documentation**:
  - Added new `debugging_mcp_servers.md` with comprehensive debugging guidance
  - Expanded troubleshooting section with detailed error explanations
  - Added technical details about MCP communication channels
  - Included instructions for handling port conflicts
- **Testing improvements**:
  - Verified fixes work with MCP Inspector
  - Implemented and documented systematic testing approach

### 2025-03-28 (v1.0.0)
- Simplified project structure by removing dist/ and src/ directories, moving essential files to root
- Removed compiled JavaScript files for cleaner development workflow
- Updated the MCP server for direct TypeScript execution using ts-node
- Improved MCP Inspector integration with dedicated npm script
- Modified startup logging to be conditional based on environment
- Updated Claude Desktop configuration instructions to work with ts-node
- Streamlined development workflow by updating package.json scripts
- Added detailed troubleshooting section for MCP Inspector errors
