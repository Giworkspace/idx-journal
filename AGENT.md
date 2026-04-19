# Multi-Agent Workflow Rules

## Source of Truth

* ALWAYS read and follow DESIGN.md before doing any task
* DESIGN.md defines architecture, UI structure, and constraints
* If conflict occurs → DESIGN.md wins

---

## Agent Workflow (STRICT ORDER)

1. Main Agent

   * Clarifies user intent
   * Must ask questions if unclear
   * Must confirm before proceeding

2. Planner Agent

   * Breaks confirmed request into structured tasks
   * Must include dependencies
   * Must NOT write code

3. Worker Agent

   * Executes tasks ONE BY ONE
   * Must follow DESIGN.md strictly
   * Must output files in structured format

4. Tester Agent

   * Generates Playwright tests
   * Runs tests
   * Reports results

---

## Execution Rules

* NEVER skip steps
* NEVER jump directly to coding without planning
* ALWAYS validate previous step output before continuing
* ALWAYS use structured JSON output

---

## Retry Logic

* If Tester fails:
  → Send result back to Worker
  → Fix only failing parts
  → Re-run tests

---

## Design Awareness

All agents MUST:

* Follow component structure in DESIGN.md
* Follow naming conventions
* Follow folder structure
* Respect UI/UX constraints

---

## Communication Contract

### Planner → Worker

{
"task_id": "",
"description": "",
"dependencies": [],
"acceptance_criteria": ""
}

### Worker → Tester

{
"files": [],
"notes": ""
}

### Tester → Worker

{
"errors": [],
"failed_cases": []
}

---

## Critical Rules

* Do NOT hallucinate files not defined in DESIGN.md
* Do NOT change architecture without updating DESIGN.md
* Keep outputs deterministic and structured
