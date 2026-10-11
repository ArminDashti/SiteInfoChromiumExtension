---
name: caveman-stats
description: >-
  Show real token usage and estimated savings for the current session, read from the session log. Trigger: /caveman-stats.
metadata:
  version: 1.0.0
  author: "Armin Dashti"
  category: 
  tags: []
  last_updated: "2026-09-10 13:33:02"
  uuid: dbc1103d-c523-441c-9b14-fd197afb06b0
---
This skill is delivered by `hooks/caveman-stats.js` (read by `hooks/caveman-mode-tracker.js` on `/caveman-stats`). The model does not need to do anything when this skill fires — the hook returns `decision: "block"` with the formatted stats as the reason. The user sees the numbers immediately.

Output also includes `Est. rule overhead` and `Est. net` lines wherever a savings estimate exists with a known turn count. Rule overhead is the estimated per-turn INPUT-token cost of the injected caveman rules (default 1,250 tokens/turn, override with `CAVEMAN_RULE_OVERHEAD_TOKENS`) times the turn count. Net is savings minus that overhead — when negative, the output says so plainly and suggests turning caveman off for that workload, rather than hiding the net-negative regime behind a gross-savings number (see `docs/HONEST-NUMBERS.md`).
