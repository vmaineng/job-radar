import json
import logging

from anthropic import AsyncAnthropic

from agent.tools import build_tools, get_tool_functions

log = logging.getLogger(__name__)

MAX_ITERATIONS = 15
MAX_TOOL_CALLS = 40

DEMO_MAX_ITERATIONS = 8
DEMO_MAX_TOOL_CALLS = 15


def build_candidate_profile(
    search_titles: list[str] | None,
    search_location: str | None,
    include_remote: bool,
    background: str | None,
) -> str:
    titles = ", ".join(search_titles) if search_titles else "not specified"
    location = search_location or "not specified"
    remote_note = "Open to remote roles." if include_remote else "Not open to remote roles."
    background_note = background.strip() if background else "No additional background provided."

    return f"""
Targeting roles: {titles}
Preferred location: {location}. {remote_note}

Candidate background:
{background_note}
"""


def build_system_prompt(
    skip_enrichment: bool,
    search_titles: list[str] | None = None,
    search_location: str | None = None,
    include_remote: bool = True,
    background: str | None = None,
) -> str:
    candidate_profile = build_candidate_profile(
        search_titles, search_location, include_remote, background
    )

    enrichment_instructions = (
        "5. If no posting scores 50 or higher, skip enrichment entirely for this run."
        if not skip_enrichment
        else "5. Do NOT call enrich_contact for this run — contact enrichment is disabled."
    )
    step4 = (
        """4. After all postings are scored and saved, identify the single highest-scoring
   posting from this run. If its relevance_score is at least 50, call
   enrich_contact for that posting only — contact lookups are budget-limited,
   so never call it more than once per run, and never on a posting below 50."""
        if not skip_enrichment
        else "4. Do not attempt contact enrichment — that step is disabled for this run."
    )

    return f"""You are Job Radar, an agent that finds and evaluates job postings for a candidate.

Candidate profile:
{candidate_profile}

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

Do not describe or summarize what you are about to do instead of doing it.
Every posting from search_jobs must get an actual save_to_dashboard tool call
in this same turn or the next — narrating your plan without emitting the tool
calls is not a valid way to complete this step.

Briefly narrate what you're doing in plain language before each tool call
(one short sentence), since this reasoning is shown to someone watching the
agent work.
"""


async def run_job_radar_agent(
    user_id: str,
    api_key: str,
    search_titles: list[str] | None = None,
    search_location: str | None = None,
    include_remote: bool = True,
    background: str | None = None,
    skip_enrichment: bool = False,
    demo_mode: bool = False,
) -> dict:

    client = AsyncAnthropic(api_key=api_key)

    max_iterations = DEMO_MAX_ITERATIONS if demo_mode else MAX_ITERATIONS
    max_tool_calls = DEMO_MAX_TOOL_CALLS if demo_mode else MAX_TOOL_CALLS

    tools = build_tools(skip_enrichment=skip_enrichment)
    tool_functions = get_tool_functions(skip_enrichment=skip_enrichment)
    system_prompt = build_system_prompt(
        skip_enrichment=skip_enrichment,
        search_titles=search_titles,
        search_location=search_location,
        include_remote=include_remote,
        background=background,
    )

    messages = [{"role": "user", "content": "Run today's job search."}]
    trace = []
    iteration = 0
    total_tool_calls = 0
    total_input_tokens = 0
    total_output_tokens = 0
    enrich_calls = 0
    saved_count = 0
    jobs_found_count = 0
    stall_retry_used = False

    while iteration < max_iterations:
        iteration += 1

        response = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=system_prompt,
            tools=tools,
            messages=messages,
        )
        log.debug("stop_reason: %s", response.stop_reason)
        total_input_tokens += response.usage.input_tokens
        total_output_tokens += response.usage.output_tokens
        messages.append({"role": "assistant", "content": response.content})

        for block in response.content:
            if block.type == "text" and block.text.strip():
                trace.append({"type": "reasoning", "text": block.text.strip()})

        tool_use_blocks = [b for b in response.content if b.type == "tool_use"]

        if not tool_use_blocks:
            if jobs_found_count > 0 and saved_count < jobs_found_count and not stall_retry_used:
                stall_retry_used = True
                trace.append({
                    "type": "system",
                    "text": (
                        f"Agent found {jobs_found_count} postings but only saved "
                        f"{saved_count} — nudging it to finish the job."
                    ),
                })
                messages.append({
                    "role": "user",
                    "content": (
                        f"You found {jobs_found_count} postings from search_jobs but have "
                        f"only called save_to_dashboard {saved_count} time(s). Call "
                        f"save_to_dashboard now for every posting that hasn't been saved yet. "
                        f"Do not describe the plan — emit the tool calls."
                    ),
                })
                continue
            break

        total_tool_calls += len(tool_use_blocks)

        if total_tool_calls > max_tool_calls:
            trace.append(
                {"type": "system", "text": "Tool call budget exceeded — wrapping up."}
            )
            tool_results = [
                {
                    "type": "tool_result",
                    "tool_use_id": b.id,
                    "content": "Skipped — daily tool call budget exceeded.",
                }
                for b in tool_use_blocks
            ]
            messages.append({"role": "user", "content": tool_results})
            break

        tool_results = []
        for block in tool_use_blocks:
            trace.append(
                {"type": "tool_call", "tool": block.name, "input": dict(block.input)}
            )
            try:
                kwargs = dict(block.input)
                if block.name == "enrich_contact":
                    kwargs["calls_this_run"] = enrich_calls
                    enrich_calls += 1
                if block.name == "search_jobs":
                    kwargs["search_titles"] = search_titles
                    kwargs["search_location"] = search_location
                    kwargs["include_remote"] = include_remote
                    kwargs["user_id"] = user_id
                if block.name == "save_to_dashboard":
                    kwargs["user_id"] = user_id
                result = await tool_functions[block.name](**kwargs)
            except TypeError as e:
                log.warning(f"Malformed tool call for {block.name}: missing/invalid args — {e}")
                result = {
            "status": "error",
            "reason": f"Tool call was missing required arguments: {e}",
        }
            except Exception as e:
                log.exception(f"Error calling tool {block.name}")
                result = {"error": str(e)}

            if block.name == "search_jobs" and isinstance(result, dict) and "count" in result:
                jobs_found_count = result["count"]
            if block.name == "save_to_dashboard" and isinstance(result, dict) and "error" not in result:
                saved_count += 1

            trace.append({"type": "tool_result", "tool": block.name, "result": result})
            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result),
                }
            )
        messages.append({"role": "user", "content": tool_results})

    if iteration >= max_iterations:
        log.warning(f"Job Radar agent hit max_iterations ({max_iterations})")

    cost_estimate = (total_input_tokens / 1_000_000 * 3.00) + (
        total_output_tokens / 1_000_000 * 15.00
    )

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