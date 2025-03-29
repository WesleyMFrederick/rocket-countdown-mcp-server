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
  "continueCountdown",
  "Simulate a rocket countdown by progressively counting down numbers. Start with an initial number and continue until reaching zero for 'BLAST OFF!'. Each call displays the current number and provides the next number to count down. The LLM should display the current number then call continueCcountdown with the next number.",
  // NEW SCHEMA: Removed z.preprocess
  {
    current_number: z.number() // Using z.number() directly
      .int()
      .min(0)
      .max(10)
      .describe("The current number in the rocket countdown sequence. Must be between 0 and 10.")
  },
  // NEW HANDLER START: Added explicit validation
  async (args, _extra) => {
    // Explicitly get, convert, and validate the input number
    const rawInput = args.current_number;
    console.error(`Debug: Received raw input: ${rawInput}, type: ${typeof rawInput}`);
    
    const current_number = Number(rawInput); // Convert to number

    // Validate the number
    if (isNaN(current_number) || !Number.isInteger(current_number) || current_number < 0 || current_number > 10) {
      console.error(`Validation Error: Invalid input received: ${rawInput}`);
      // Throw an error for invalid input
      throw new Error(`Invalid input: current_number must be an integer between 0 and 10. Received: ${rawInput}`); 
    }

    console.error(`Debug: Processed current_number: ${current_number}, type: ${typeof current_number}`);
    // Wait for 1 second before processing
    await delay(1000);

    // Rest of the handler logic using the validated 'current_number'
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
  // Completely silent startup for MCP environments
  const transport = new StdioServerTransport();
  await server.connect(transport);
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
