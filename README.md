# Rocket Countdown MCP Server

This is a Model Context Protocol (MCP) server that implements a rocket countdown timer. It allows users to start, stop, and reset a countdown, and displays "BLAST OFF!" when the countdown reaches zero.

## Features

- Start a countdown from 10 to 1, followed by "BLAST OFF!"
- Stop the countdown at any time
- Reset the countdown to a specific value
- Get the current status of the countdown

## Tools

The server exposes the following tools:

1. `start-countdown`: Starts the countdown if it's not already running
2. `stop-countdown`: Stops a running countdown
3. `reset-countdown`: Resets the countdown to a specified value (default: 10)
4. `get-countdown-status`: Returns the current countdown status

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

3. **Environment Issues**: If you encounter issues with the MCP server in Claude Desktop, it may be because the app is using `spawn ${command} ${arguments}`, meaning it's starting a new process directly without the context of your shell environment (which contains your path, nvm settings, etc.).

   - **Solution**: You can solve this by using bash as an intermediary:

```json
"rocket-countdown": {
    "command": "bash",
    "args": [
        "-c",
        "npx rocket-countdown-mcp"
    ]
}
```

This approach works particularly well for other MCP servers too, for example:

```json
"filesystem": {
    "command": "bash",
    "args": [
        "-c",
        "npx @modelcontextprotocol/server-filesystem ~/Downloads"
    ]
}
```

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
- `docs/`: Implementation documentation
- `llm_docs/`: Documentation about MCP
- `obsidian_docs/`: Additional Obsidian documentation
- `index.js`: The compiled JavaScript (created when running `npm run build` or `npm run inspect`, needed for MCP Inspector)

## How to Connect

This MCP server uses stdio for communication, so it can be connected to any MCP client that supports the stdio transport.

### Using with Claude Desktop

Claude Desktop fully supports MCP and can connect to this server. To use with Claude Desktop:

1. Download and install [Claude Desktop](https://claude.ai/download) if you haven't already
2. Open Claude Desktop
3. Click on the settings gear icon in the lower left
4. Navigate to "MCP Servers"
5. Click "Add Server"
6. Select "Local Process" as the server type
7. Enter the following details:
   - Name: Rocket Countdown
   - Command: npx
   - Arguments: --yes ts-node-esm index.ts
   - Working Directory: (the path to this repository)

   Your configuration in the Claude Desktop interface should look like this:
   ```json
   "rocket-countdown": {
     "command": "npx",
     "args": ["--yes", "ts-node-esm", "index.ts"],
     "workingDirectory": "/path/to/rocket-countdown-mcp"
   }
   ```

### Alternative: Using with npm run

If you have the repository cloned locally, you can also use `npm run` to start the server:

1. Clone this repository locally
2. Run `npm install` to install dependencies
3. Configure Claude Desktop with:
   - Name: Rocket Countdown
   - Command: npm
   - Arguments: ["run", "start"]
   - Working Directory: (the path to this repository)

   Your configuration would look like this:
   ```json
   "rocket-countdown": {
     "command": "npm",
     "args": ["run", "start"],
     "workingDirectory": "/path/to/rocket-countdown-mcp"
   }
   ```

   This approach runs the server directly from the repository using npm.

1. Open Claude Desktop settings
2. Add a new MCP server
3. Enter the following details:
   - Name: Rocket Countdown
   - Command: bash
   - Arguments: ["-c", "cd /path/to/repository && npx ts-node-esm index.ts"]

   Your configuration would look like this:
   ```json
   "rocket-countdown": {
     "command": "bash",
     "args": ["-c", "cd /path/to/repository && npx ts-node-esm index.ts"]
   }
   ```

   This approach uses npx to temporarily install and run the package.

### Using with MCP Inspector

For testing and development, you can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which provides a web interface to test your MCP server.

To use the inspector with this project, you can simply run:

```bash
npm run inspect
```

This is the easiest approach, as it handles both compiling the TypeScript file and starting the inspector.

Alternatively, you can do it manually in two steps:

```bash
npm run build
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

1. Call the `start-countdown` tool to begin the countdown
2. The server will output each number in the countdown
3. When the countdown reaches 1, it will output "BLAST OFF!"
4. Call the `stop-countdown` tool to pause the countdown
5. Call the `reset-countdown` tool to set the countdown back to 10 (or any other value)
6. Call the `get-countdown-status` tool to check the current state
7. Use the new `continue-countdown` tool for an interactive, step-by-step countdown

### Interactive Countdown Feature
The server now supports a step-by-step countdown mechanism through the `continue-countdown` tool. This allows for a more interactive countdown where each step can be explicitly controlled.

### Using the Countdown in Claude Desktop

Once you've set up the server in Claude Desktop using one of the methods described above:

1. In a chat with Claude, type: "@Rocket" and select "Rocket Countdown" from the dropdown
2. To start the countdown, click "start-countdown" or ask Claude to start the countdown
3. You'll see the countdown numbers appear in the chat
4. To stop the countdown before it completes, click "stop-countdown" or ask Claude to stop it
5. To check the status, click "get-countdown-status" or ask Claude about the current status
6. To reset the countdown, click "reset-countdown" or ask Claude to reset it (you can specify a new starting value)

Example prompt: "@Rocket Countdown I'd like to start the rocket launch sequence"

You can also combine instructions: "@Rocket Countdown Please start the countdown, then after a few seconds stop it, and then reset it to 5"

## License

MIT

## Changelog

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