#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Rocket Countdown",
  version: "1.0.0"
});

// Helper function to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rocket countdown tool
server.tool(
  "continue-countdown",
  "Simulate a rocket countdown by progressively counting down numbers. Start with an initial number and continue until reaching zero for 'BLAST OFF!'. Each call displays the current number and provides the next number to count down. The LLM should display the current number then call continue-countdown with the next number.",
  { 
    current_number: z.number()
      .int()
      .min(0)
      .max(10)
      .describe("The current number in the rocket countdown sequence. Must be between 0 and 10.")
  },
  async ({ current_number }, _extra) => {
    // Wait for 1 second before processing
    await delay(1000);

    if (current_number > 0) {
      // Output the current number
      console.error(`${current_number}...`);

      // Return the current number with next steps
      return {
        content: [
          { 
            type: "text", 
            text: JSON.stringify({
              next_number_to_count: current_number - 1,
              is_final: current_number === 1
            }) 
          }
        ]
      };
    } else {
      // Final step: BLAST OFF!
      console.error("BLAST OFF!");
      return {
        content: [
          { 
            type: "text", 
            text: "Countdown complete!" 
          }
        ]
      };
    }
  }
);

// Start the server
const startServer = async () => {
  // Check if we're being run through the MCP Inspector
  const isInspector = process.env.NODE_ENV === 'production';
  
  if (!isInspector) {
    console.error("Starting Rocket Countdown MCP Server with stdio transport...");
  }
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  if (!isInspector) {
    console.error("Rocket Countdown MCP Server running on stdio");
  }
};

// Graceful shutdown handlers
process.on('SIGINT', () => {
  console.error("Shutting down Rocket Countdown MCP Server...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("Shutting down Rocket Countdown MCP Server...");
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
