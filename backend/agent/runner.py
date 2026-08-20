import logging
from anthropic import Anthropic
from agent.tools import tool_functions, build_tools

log = logging.getLogger(__name__)
client = Anthropic()

MAX_ITERATIONS = 15
MAX_TOOL_CALLS = 40

DEMO_MAX_ITERATIONS = 8
DEMO_MAX_TOOL_CALLS = 15

CANDIDATE_PROFILE = """
Career changer from finance (FP&A) into software engineering, bootcamp grad.
Stack: React, TypeScript, Next.js, Python, FastAPI, Supabase, Claude API integration.
Also has a finance/FP&A background (Excel/SQL, budget-vs-actual reporting).
Targeting junior/entry-level/associate roles in software engineering, business
analysis, or solutions analysis, in Los Angeles or remote.
"""

def build_system_prompt(skip_enrichment: bool) -> str:
    enrichment_instructions = (
        "5. If no posting scores 50 or higher, skip enrichment entirely for this run."
        if not skip_enrichment else
        "5. Do NOT call enrich_contact for this run — contact enrichment is disabled."
    )
    step4 = (
        """4. After all postings are scored and saved, identify the single highest-scoring
   posting from this run. If its relevance_score is at least 50, call
   enrich_contact for that posting only — contact lookups are budget-limited,
   so never call it more than once per run, and never on a posting below 50."""
        if not skip_enrichment else
        "4. Do not attempt contact enrichment — that step is disabled for this run."
    )

    return f"""You are Job Radar, an agent that finds and evaluates job postings for a candidate.

Candidate profile:
{CANDIDATE_PROFILE}

Your workflow for each run:
1. Call search_jobs (no arguments) to get new, unseen postings.
2. For each posting returned, evaluate its fit and assign:
   - "relevance_score": integer 0-100, based on how well the posting matches
     the candidate's level (junior/entry/associate — penalize heavily if it's
     clearly mid/senior) and technical/domain fit
   - "relevance_reason": one short sentence (under 20 words) explaining the score
3. Call save_to_dashboard for every posting, passing the job data along with
   your relevance_score and relevance_reason.
{step4}
{enrichment_instructions}

Work through all postings from search_jobs before deciding which one (if any)
gets enrichment — you need every score to know which is actually the top match.

Briefly narrate what you're doing in plain language before each tool call
(one short sentence), since this reasoning is shown to someone watching the
agent work.
"""

async def run_job_radar_agent(   search_titles: list[str] | None = None,
    search_location: str | None = None,
    include_remote: bool = True,
    skip_enrichment: bool = False,
    demo_mode: bool = False,
) -> dict:

    max_iterations = DEMO_MAX_ITERATIONS if demo_mode else MAX_ITERATIONS
    max_tool_calls = DEMO_MAX_TOOL_CALLS if demo_mode else MAX_TOOL_CALLS

    tools = build_tools(skip_enrichment=skip_enrichment)
    system_prompt = build_system_prompt(skip_enrichment=skip_enrichment)

    messages = [{"role": "user", "content": "Run today's job search."}]
    trace=[]
    iteration = 0
    total_tool_calls = 0
    total_input_tokens = 0
    total_output_tokens = 0
    enrich_calls = 0
    saved_count = 0

    while iteration < MAX_ITERATIONS:
        iteration += 1

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            system=system_prompt,
            tools=tools,
            messages=messages
        )
        total_input_tokens += response.usage.input_tokens
        total_output_tokens += response.usage.output_tokens
        messages.append({"role": "assistant", "content": response.content})

        for block in response.content:
            if block.type == "text" and block.text.strip():
                trace.append({"type": "reasoning", "text": block.text.strip()})

        if response.stop_reason != "tool_use":
            break

        tool_use_blocks = [b for b in response.content if b.type == "tool_use"]
        total_tool_calls += len(tool_use_blocks)

        if total_tool_calls > MAX_TOOL_CALLS:
            trace.append({"type": "system", "text": "Tool call budget exceeded — wrapping up."})
            tool_results = [
                {
                    "type": "tool_result",
                    "tool_use_id": b.id,
                    "content": "Skipped — daily tool call budget exceeded."
                }
                for b in tool_use_blocks
            ]
            messages.append({"role": "user", "content": tool_results})
            break
        tool_results = []
        for block in tool_use_blocks:
            try:
                kwargs = dict(block.input)
                if block.name == "enrich_contact":
                    kwargs["calls_this_run"] = enrich_calls
                    enrich_calls += 1
                if block.name == "search_jobs":
                    kwargs["search_titles"] = search_titles
                    kwargs["search_location"] = search_location
                    kwargs["include_remote"] = include_remote
                result = await tool_functions[block.name](**kwargs)
                if block.name == "save_to_dashboard" and result.get("status") == "saved":
                    saved_count += 1
            except Exception as e:
                log.exception(f"Error calling tool {block.name}")
                result = {"error": str(e)}
            trace.append({"type": "tool_result", "tool": block.name, "result": result})
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": str(result)
            })
        messages.append({"role": "user", "content": tool_results})

    if iteration >= MAX_ITERATIONS:
        log.warning(f"Job Radar agent hit MAX_ITERATIONS ({MAX_ITERATIONS})")

    cost_estimate = (total_input_tokens / 1_000_000 * 3.00) + (total_output_tokens / 1_000_000 * 15.00)

    return {
        "saved_count": saved_count,
        "iterations": iteration,
        "tool_calls": total_tool_calls,
        "enrich_calls": enrich_calls,
        "input_tokens": total_input_tokens,
        "output_tokens": total_output_tokens,
        "estimated_cost_usd": round(cost_estimate, 4),
        "trace": trace,
    }