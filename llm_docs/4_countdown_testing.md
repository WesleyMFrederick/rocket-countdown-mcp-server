# Countdown MCP Server Testing Guide

## Testing Goal
Validate step-by-step countdown mechanism through MCP tool calls.

## Test Scenarios
1. Start countdown from default (10)
2. Continue countdown by passing current number
3. Verify decrementing works correctly
4. Check final "BLAST OFF!" state

## Test Inputs
```json
// First call (no number)
{
  "method": "call_tool",
  "params": {
    "name": "continue-countdown",
    "arguments": {}
  }
}

// Subsequent calls
{
  "method": "call_tool", 
  "params": {
    "name": "continue-countdown",
    "arguments": {"current_number": 9}
  }
}
```

## Expected Outputs
- Each call returns:
  1. Display text (e.g., "10...")
  2. Instruction for next number
  3. Final "BLAST OFF!" at end

## Key Testing Principles
- Maintain MCP protocol integrity
- Use `console.error()` for logging
- Ensure clean JSON communication
