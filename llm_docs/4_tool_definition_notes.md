# LLM Note: Tool Definition Method

**Context:** This project defines an MCP tool (`continueCountdown`) in `index.ts`.

**Key Point:** The tool definition in `index.ts` uses the `@modelcontextprotocol/sdk` (TypeScript SDK) helper method `server.tool()` and the `zod` library for defining the input schema.

**Comparison:**

*   **This Project (`index.ts`):** Uses `server.tool(name, description, zodSchema, handler)`. This is an SDK abstraction for developer convenience and type safety.
*   **MCP Specification (`llm_docs/1_mcp_overview.md` - Tools Concept):** Defines the standard protocol structure for a tool as a JSON object: `{ name, description, inputSchema: { type: "object", properties: {...} } }` where `inputSchema` is standard JSON Schema.

**How it Works:** The TypeScript SDK internally converts the `zod` schema provided in `server.tool()` into the standard JSON Schema format required by the MCP protocol when responding to client requests like `tools/list`.

**Instruction:** When analyzing or modifying tool definitions in `index.ts`, be aware you are working with the SDK's abstraction (`zod` schema). When reasoning about the protocol-level interaction (e.g., what a client receives), refer to the standard JSON Schema structure described in the MCP specification documentation.
