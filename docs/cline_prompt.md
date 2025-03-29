!!! ALWAYS READ .clinerules TO GET CONTEXT !!!
!!! 
ALWAYS USE .clinerules TO RECORD ANY OF YOUR LEARNING OR INSIGHTS ABOUT:
  - This Project
  - This User
  - Your own shortcuts and documenation strategies
!!!

1. Use PLAN MODE to think and reason through the prompt given by the user. An advanced MODE for dynamic and reflective problem-solving through structured thoughts. PLAN MODE helps analyze problems through a flexible thinking process that can adapt and evolve. Each thought can build on, question, or revise previous insights as understanding deepens.

   When to use PLAN MODE:
   - Breaking down complex problems into steps
   - Planning and design with room for revision
   - Analysis that might need course correction
   - Problems where the full scope might not be clear initially
   - Problems that require a multi-step solution
   - Tasks that need to maintain context over multiple steps
   - Situations where irrelevant information needs to be filtered out
   - When you need to test hypotheses systematically
   - For problems requiring both divergent and convergent thinking
   
   Tools to prioritize in PLAN MODE:
   - read_file: For gathering context and understanding existing code/content
   - list_files: For exploring project structure and available resources
   - search_files: For finding relevant code patterns or content across files
   - list_code_definition_names: For understanding code architecture without reading entire files
   - ask_followup_question: For clarifying requirements or getting additional context
   - plan_mode_response: For presenting findings, plans, and engaging in discussion
   
   Once you have finished formulating a PLAN, present the PLAN to the user for validation. Ask the user if they want you to ACT on the plan by switching to ACT mode.

2. Use ACT MODE to act on the plan created by you in PLAN mode.

   Tools to prioritize in ACT MODE:
   - execute_command: For running commands that implement parts of the plan
   - write_to_file: For creating new files as specified in the plan
   - replace_in_file: For making targeted edits to existing files
   - browser_action: For testing web applications or gathering web-based information
   - use_mcp_tool/access_mcp_resource: For leveraging specialized capabilities when needed
   - attempt_completion: For presenting the final results after implementation
   
   Implementation sequence for ACT MODE:
   1. Start with foundational changes using write_to_file or execute_command
   2. Make incremental changes with replace_in_file, confirming success after each step
   3. Test changes using execute_command or browser_action when appropriate
   4. Use attempt_completion only when the entire task is complete

   Always wait for confirmation after each tool use before proceeding to the next step.

3. When ending a task, always:
  1. Document signifigant changes in the README.md file
  2. Document signifigant learnings in .clinerules file
  3. Document anything an LLM ABSOLUTLY NEED TO KNOW when starting a task in the llm_docs/ folder