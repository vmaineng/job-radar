# Job Radar
 
An autonomous agent that searches for junior/entry-level software engineering
job postings, scores each one for fit, finds a hiring contact at the top
match, and surfaces everything on a dashboard — so applying is a same-day
decision, not a research project.
 
Built as a working demonstration of a real Claude tool-calling agent (not a
hardcoded pipeline dressed up as one), aimed at showing the reasoning process
itself, not just the final output.

[![Live Link](https://img.shields.io/badge/demo-live-brightgreen)](https://job-radar-fawn.vercel.app/)
 
## Why this exists
 
Job searching for junior roles means sifting through a lot of noise every
day: postings that are actually mid/senior in disguise, companies with no
clear point of contact, and no good way to know which five postings out of
fifty are actually worth a cover letter. Job Radar runs once a day, does that
filtering and scoring automatically, and leaves a short, ranked list with a
name to reach out to.
 
## Technologies
 
**Backend**
- Python, FastAPI
- Anthropic Claude API (agentic tool-calling loop, `AsyncAnthropic`) - used to do async work
- Supabase (Postgres + auth)
- `httpx` (async HTTP client)
- Pydantic
**Frontend**
- Next.js (App Router), TypeScript, React
- Tailwind CSS
**Data sources**
- Adzuna API — job postings
- Hunter.io API — contact enrichment (with a LinkedIn-search-link fallback
  when no email is found or the monthly quota is exhausted)
**Infra / tooling**
- GitHub Actions — daily scheduled pipeline run
- pyenv + per-project virtualenv for dependency isolation
## The agentic loop
 
Job Radar doesn't run as a fixed sequence of function calls (search → score
→ save → enrich). Instead, Claude drives the process itself through a
**tool-calling loop**: Claude decides which tool to call next, sees the
result, and decides what to do after that — the same way it would in a
back-and-forth conversation, except the "replies" are tool results instead
of typed messages.
 
**The tools Claude can call:**
 
| Tool | Purpose |
|---|---|
| `search_jobs` | Fetch new, previously-unseen postings for the day |
| `save_to_dashboard` | Persist a scored posting (with Claude's fit score and reasoning) |
| `enrich_contact` | Look up a hiring contact for one posting via Hunter.io |
 
**How the agentic cycle unfolds:**
 
1. The agent is given a system prompt describing the candidate's profile and
   a workflow: search first, score everything, save every posting, then
   (only for the single best match) look up a contact.
2. Claude calls `search_jobs`. The result — a list of new postings — comes
   back as a tool result, appended to the conversation.
3. Claude reasons over each posting, assigns a `relevance_score` (0–100) and
   a one-line `relevance_reason`, and calls `save_to_dashboard` once per
   posting.
4. Once every posting from that day's search has been scored and saved,
   Claude identifies its own single highest-scoring pick and — only if that
   score clears a minimum threshold — calls `enrich_contact` exactly once.
5. The loop ends when Claude stops requesting tools (`stop_reason !=
   "tool_use"`) or a hard iteration/tool-call ceiling is hit.
**Why a loop instead of a pipeline:** the ordering and judgment calls here
(which posting is "the" top match, whether any posting even clears the bar
for contact lookup) aren't things you can cleanly pre-script — they depend
on Claude's own scoring output from earlier in the same run. A hardcoded
pipeline would need to re-implement that judgment in Python; the tool-calling
loop lets Claude make the call and simply enforces hard limits around it in
code (see below), so the *reasoning* stays with the model and the *safety
rails* stay in the codebase.
 
**Guardrails around the loop** (because letting a model call real,
budget-limited, paid APIs needs backstops that don't depend on the model
following instructions perfectly):
- A hard cap on total iterations and total tool calls per run — if Claude
  ever gets stuck looping, the run terminates rather than running forever.
- `enrich_contact` can only be called once per run, enforced in code (not
  just in the prompt) via a `calls_this_run` counter passed into the
  handler.
- `enrich_contact` refuses to run at all below a minimum relevance score,
  again enforced in the handler itself, not just requested via the prompt.
- A monthly Hunter.io usage counter, checked before every call, so a string
  of daily runs can never quietly exceed the API's free-tier quota.
- A separate, lower set of limits (`demo_mode`) for public-facing demo runs,
  so a stranger testing the demo can't rack up the same real-world API costs
  as a production run.
## What I learned building this
 
**Async isn't automatic — it has to be true all the way down.**
Marking a function `async def` doesn't make the code inside it
non-blocking; every call it makes needs to actually be awaitable, or it
needs to be explicitly offloaded (`asyncio.to_thread`). A single
synchronous, blocking call anywhere in the chain — even buried three
functions deep — stalls the entire event loop for every other request or
task sharing it. This came up repeatedly: a Supabase client that's sync by
default, an Anthropic client that has both sync and async variants, and
handlers that were declared `async` without anything inside them actually
using `await`.
 
**Guard logic and error handling belong in the DB/API layer, not scattered
across callers.** Centralizing "does this exist," "did this succeed,"
and "log and return `None`/`False` on failure" inside the storage layer
kept the handler functions focused on orchestration and made failure modes
consistent (and testable) instead of ad hoc per call site.
 
**Fail-open vs. fail-closed is a real design decision, not a default.**
When a safety check itself fails (e.g., can't verify whether a job's
already been seen, or can't verify remaining API quota), the "safe" answer
depends on which mistake is cheaper: risking a duplicate job save is
low-cost (fail open), but risking an unbudgeted paid API call is not
(fail closed). Worth deciding deliberately for each check rather than
picking one default everywhere.
 
**Race conditions hide in "check, then act" patterns.** A pre-check
(`does this email already have a demo run?`) followed by a delayed write
left a real window where two near-simultaneous requests could both pass the
check. Moving the uniqueness guarantee to the database itself (a `UNIQUE`
constraint) and catching the resulting write failure closed the window that
application-level logic alone couldn't.
 
**Consistent return shapes matter more than they seem to.** Handlers that
sometimes included a key (`job_id`) and sometimes didn't made every caller
have to guess at the shape. Standardizing on one shape per handler type,
even for error/skip paths, made the whole tool-calling loop's dispatch code
simpler and less error-prone.
 
**Environment issues can look like code bugs.** A missing `__init__.py`,
a stale editor interpreter setting, and a pyenv shim pointing at the wrong
virtualenv all produced errors that looked like import or dependency
problems, but had nothing to do with the code itself. Verifying `which
python` and where a package actually resolved to (`module.__file__`) before
assuming the code was wrong saved real debugging time.
 
## Status
 
Functional end-to-end: authentication, guest preview, and a working
dashboard UI. Daily pipeline runs are scheduled via GitHub Actions. A
gated, pre-recorded demo mode exists for sharing with potential employers
without spending real API budget on every visitor.
 

