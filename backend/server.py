from flask import Flask, render_template_string, request, jsonify
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.schedulers.background import BackgroundScheduler
from flask_cors import CORS
from google import genai
from google.genai.errors import ClientError, ServerError
from google.genai import types
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pathlib import Path
from collections import Counter, defaultdict
# Email service
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.utils import formataddr
from email import encoders
from icalendar import Calendar, Event, vRecur
from urllib.parse import quote
import socket
import ssl
#
import pytz
import uuid
import requests
import time
import json
import threading
import datetime as dt
import os

load_dotenv()
client = genai.Client()
app = Flask(__name__)
CORS(app)

# AI PROMPTS
forge_decision_architect_prompt = """
You are FORGE-DECISION-ARCHITECT.

Your job is to FILL A PREDEFINED STRATEGY TEMPLATE.
Your role is to design a practice system for long-term skill mastery.

You are NOT allowed to invent new fields.
You are NOT allowed to rename fields.
You are NOT allowed to omit required fields.
You do NOT motivate.
You do NOT give generic advice.
You do NOT optimize for speed.
You do NOT speak with an authoritative tone.

You decompose skills into trainable components.
You think in weeks, not days.
You balance focus between core and supporting components.
You balance difficulty between comfortable and challenging.
You create evaluation metrics that capture both subjective and objective progress.
You speak like a practice architect, NOT too formal.
You speak like you are in the shoes of a learner planning their own practice.
You design practice loops that can be evaluated over time.

You collect the following information:
- Skill name
- Current proficiency level
- Target proficiency level
- Available weekly time in hours

Your task:
1. Normalize raw human input into a precise machine-readable specification.
2. Design an initial practice strategy for long-term skill mastery.

Rules:
- Do not remove nuance from user input.
- Explicitly mark inferred data.
- Output STRICT JSON only.
- No commentary outside JSON.

If information is missing, infer it and list it in "inferred_fields".

You MUST output JSON that EXACTLY matches the schema provided.
Any deviation is an error.

Schema you must follow exactly:

{
  "meta": {
    "agent": "forge",
    "version": "v1"
  },

  "normalized_input": {
    "skill_name": "string",
    "current_level": "number (0-4)",
    "target_level": "number (0-4)",
    "weekly_time_hours": "number",
    "constraints": {
      "learning_style": "string",
      "dropout_risk": "string"
    },
    "inferred_fields": [ "string" ]
  },

  "strategy": {
    "strategy_version": 1,

    "skill_model": {
      "core_components": [ "string" ],
      "supporting_components": [ "string" ]
    },

    "practice_cycles": [
      {
        "cycle_index": 1,
        "duration_weeks": "number", (Confer the number of weeks suitable for this cycle and it must not be more than 4 weeks. Some cycles must show weeks other than 4!)
        "focus_summary": "string",
        "short_explanation_for_cycle": "string" (NOTE: Explicitly tell the user why this phase is necessary according to your responses so far. Start the sentence with "This phase...") (Use only "your" not "my" in your responses) (The sentence must not be less than 55 words),
        "weekly_loop": {
          "primary_activity": [ "string" ], (Give at most 3 primary activities)
          "secondary_activity": [ "string" ] (Give at most 3 secondary activities)
        },
        "difficulty_profile": {
          "comfortable": "string",
          "challenging": "string"
        },
        "success_markers": {
          "objective": [ "string" ],
          "subjective": [ "string" ]
        }
      }
    ],

    "evaluation_metrics": {
      "objective": [ "string" ],
      "subjective": [ "string" ]
    },

    "architect_notes": [ "string" ]
  }
}

Output STRICT JSON only.


"""

forge_analyzer = """
You are FORGE-ANALYZER.

Your role is to analyze a SINGLE practice session in context.

You do NOT:
- Change the strategy
- Recommend actions
- Motivate the user
- Predict future outcomes

You ONLY observe, classify, and score signals.

You think carefully because human self-reports are noisy.

Inputs you receive:
1. Practice Session Data (array of 3 consecutive practice sessions log):
   - activity (string)
   - duration_minutes (number)
   - difficulty_rating (1–10)
   - fatigue_level (1–10)
   - optional reflection text

2. Current Strategy Snapshot:
   - current cycle focus
   - intended difficulty balance
   - intended primary activity

Your task:
Extract interpretable signals from this session.

You must detect:
- Effort quality (not just duration)
- Challenge alignment vs intended difficulty
- Friction signals
- Positive reinforcement signals

Rules:
- Base conclusions only on evidence
- If evidence is weak, say so
- Prefer “uncertain” over guessing
- Remain neutral and analytical

Output STRICT JSON only.
No commentary outside JSON.

Additional responsibility (CRITICAL):

Based on the extracted signals ONLY, you must determine whether this analysis
warrants escalation to the FORGE-OPTIMIZER.

Escalation means:
- The current strategy MAY no longer be optimal
- OR continued execution without adjustment may cause harm or stagnation

You MUST NOT propose changes.

You MUST ONLY emit a boolean escalation signal and evidence-based reasons.

Escalation should occur ONLY IF:
- Strong negative signals persist across multiple sessions
- OR fatigue/overload risk is high with high confidence
- OR challenge alignment is consistently misaligned

If evidence is insufficient or ambiguous:
- Set should_optimize = false
- Explicitly say why

You MUST follow this schema exactly:

{
  "analysis_version": 1,
  "session_analysis": {
    "effort_level": "low | moderate | high",
    "challenge_alignment": "under-challenged | aligned | over-challenged",
    "friction_signals": [ "string" ],
    "positive_signals": [ "string" ]
  },

  "flags": {
    "fatigue_risk": true | false,
    "motivation_risk": true | false,
    "overload_risk": true | false
  },

  "analysis_confidence": "number (0–1)",

  "optimizer_signal": {
  "should_optimize": true | false,
  "reason_codes": [
    "persistent_overload",
    "fatigue_spike",
    "strategy_misalignment",
    "repeated_friction"
  ],
  "confidence": 0.0 – 1.0
}

  "analysis_notes": [
    "Short evidence-based observations explaining key classifications"
  ]
}

"""

forge_optimizer = """
You are FORGE-OPTIMIZER.

You reason over time, not isolated events.

Your task is to decide whether the current practice strategy
should remain unchanged or be adjusted, based on accumulated evidence.

You do NOT react to single sessions.
You ONLY act when patterns are confident.

You receive:
- The current active strategy
- Strategy history
- Aggregated analytics summary
- One or more analysis batches (each covering multiple sessions)

You may:
- Keep the strategy unchanged
- OR produce a revised strategy

If you revise the strategy:
- You MUST increment strategy_version by 1
- You MUST preserve the original long-term goal
- You MAY adjust only:
  - Cycle duration
  - Weekly intensity
  - Difficulty sequencing
  - Recovery constraints

You must justify every change using explicit evidence.

You must NOT:
- Over-optimize
- Reset progress unnecessarily
- Simplify unless overload or fatigue is persistent
- Change strategy if confidence is low

Decision rules:
- If overload_risk is TRUE across multiple analysis batches
  AND optimizer_signal.confidence ≥ 0.85 → consider adjustment
- If challenge_alignment is consistently over-challenged → rebalance difficulty
- If motivation_risk is FALSE → do NOT simplify excessively

Output STRICT JSON only.
No commentary outside JSON.

You MUST follow this schema exactly:

{
  "decision": "no_change | strategy_adjusted",

  "new_strategy": null | {
    "strategy_version": "number",
    "skill_model": {
      "core_components": [ "string" ],
      "supporting_components": [ "string" ]
    },

    "practice_cycles": [
      {
        "cycle_index": 1,
        "duration_weeks": "number",
        "focus_summary": "string",
        "short_explanation_for_cycle": "string" (NOTE: Explicitly tell the user why this phase is necessary according to your responses so far. Start the sentence with "This phase...") (Use only "your" not "my" in your responses) (The sentence must not be less than 55 words),
        "weekly_loop": {
          "primary_activity": "string",
          "secondary_activity": "string"
        },
        "difficulty_profile": {
          "comfortable": "string",
          "challenging": "string"
        },
        "success_markers": {
          "objective": [ "string" ],
          "subjective": [ "string" ]
        }
      }
    ],

    "evaluation_metrics": {
      "objective": [ "string" ],
      "subjective": [ "string" ]
    },

    "architect_notes": [ "string" ]
  },

  "change_summary": {
    "structure_changes": [ "string" ],
    "intensity_changes": [ "string" ],
    "focus_changes": [ "string" ]
  },

  "reasoning": [
    "Evidence-based explanations referencing analytics and analysis batches"
  ],

  "confidence": "number (0–1)",

  "risk_notes": [
    "Potential risks introduced by this adjustment"
  ]
}



"""

# SCHEDULER CONFIG
jobstores = {
    'default': SQLAlchemyJobStore(
        url='sqlite:///forge_scheduler.db'
    )
}

executors = {
    'default': ThreadPoolExecutor(10)
}

job_defaults = {
    'coalesce': False,
    'max_instances': 1
}

# GLOBAL VARIABLES
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
AI_MEMORY_DIR = os.path.join(BASE_DIR, "AI_Memory")
memoryPath = Path(AI_MEMORY_DIR)
summaryLife = {}
scheduler = BackgroundScheduler(
    jobstores=jobstores,
    executors=executors,
    job_defaults=job_defaults,
    timezone=pytz.timezone("Africa/Lagos")
)
current_time = dt.datetime
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


# UTILITY FUNCTIONS
def send_smart_calendar_invite(user_email, skill_name, body, afterSent=False, afterMessage=""):
    # 1. Handle Timezones (Lagos/West Africa Time)
    lagos_tz = pytz.timezone('Africa/Lagos')
    # Schedule the first reminder for tomorrow at 9:00 AM WAT
    start_time = datetime.now(lagos_tz).replace(
        hour=9, minute=0, second=0) + timedelta(days=1)

    # 2. Create the Calendar Event
    cal = Calendar()
    cal.add('prodid', '-//Forge Practice Agent//mxm.dk//')
    cal.add('version', '2.0')

    event = Event()
    event.add('summary', f"Practice: {skill_name}")
    event.add('dtstart', start_time)
    event.add('dtend', start_time + timedelta(hours=1))

    # THE SMART PART: Repeat every 4 days indefinitely
    event.add('rrule', vRecur(freq='DAILY', interval=4, count=7))

    event.add('description',
              f"Consistency is key! This is your scheduled 4-day reminder to practice {skill_name}.")
    cal.add_component(event)

    # 3. Setup the Email
    msg = MIMEMultipart()
    sender_name = "Forge Agent"
    msg['Subject'] = f"🗓️ Scheduled: 4-Day Practice for {skill_name}"
    msg['From'] = formataddr((sender_name, EMAIL_USER))
    msg['To'] = user_email

    msg.attach(MIMEText(body, 'html'))

    # 4. Attach the .ics file with the "REQUEST" method
    part = MIMEBase('text', "calendar", method="REQUEST", name="invite.ics")
    part.set_payload(cal.to_ical())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment; filename="invite.ics"')
    msg.attach(part)

    # 5. Send it via Gmail's SMTP server with SSL
    try:
        # FORCE IPv4 RESOLUTION
        # This gets the IPv4 address (AF_INET) for gmail
        addr_info = socket.getaddrinfo("smtp.gmail.com", 465, socket.AF_INET)
        ipv4_address = addr_info[0][4][0]

        print(f"DEBUG: Resolved smtp.gmail.com to IPv4: {ipv4_address}")

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(ipv4_address, 465, context=context, timeout=20) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        if afterSent:
            print(afterMessage)
        else:
            print(f"Smart Invite sent to {user_email}")
    except smtplib.SMTPConnectError:
        print("Failed to connect to Gmail. Check your internet/docker network.")
    except smtplib.SMTPAuthenticationError:
        print("Gmail Login failed. Check your App Password.")
    except Exception as e:
        print(f"Email failed with error: {e}")


def monthly_follow_up_agent(user_email, skill_name):
    """
    This function is called by APScheduler every 30 days 
    to prompt the user for the next month's schedule.
    """
    # Encoding the email for the 'Stop' link
    encoded_email = quote(user_email)
    stop_link = f"https://forgev1.onrender.com/api/reminders/stop?email={encoded_email}"
    emailBodyReminder = f"""
        <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #2e7d32; margin: 0;">Forge Agent</h1>
                <p style="font-style: italic; color: #666;">Mastery through Consistency</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee;">
            <div style="padding: 20px 0;">
                <h2 style="color: #2e7d32;">New Month, New Gains!</h2>
                <p>Ready to level up your <strong>"{skill_name}"</strong> practice?</p>
                <p>Your previous strategy has been processed. We've generated a new 30-day block of practice sessions to keep your momentum high.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2e7d32; margin: 20px 0;">
                    <strong>Action Required:</strong> Open the attached <code>invite.ics</code> file to sync your next 7 sessions (every 4 days) to your calendar.
                </div>
            </div>
            <footer style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
                <p>Stay sharp, <br><strong>Forge Agent</strong></p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p>Too much mail? <a href="{stop_link}" style="color: #d32f2f; text-decoration: none;">Stop these reminders</a></p>
            </footer>
        </body>
        </html>
        """
    afterSentMessage = f"Monthly follow-up sent to {user_email}"
    send_smart_calendar_invite(user_email, skill_name, emailBodyReminder, True, afterSentMessage)


def continuous_ping():
    url = "https://forgev1.onrender.com/api/health"
    try:
        response = requests.get(url, timeout=10)
        print(f"Ping successful: {response.status_code}")
        print(f"Server is alive at {current_time.now()}")
    except Exception as e:
        print(f"Ping failed: {e}")


def run_optimizer(file):
    user_id = file[:-5]
    print(f"Optimizer Ran: {file}, timestamp: {current_time.now()}")

    opt = {}
    opt.update(callOptimizer(user_id))

    # RUNNING OPTIMIZER
    if opt["status"] == "optimized":
        memoryUpdater = loadAiMemory(user_id)
        if memoryUpdater.get('practice_logs_analysis'):
            for i, should_optimize in enumerate(memoryUpdater['practice_logs_analysis']):
                optimizable = should_optimize['optimizer_signal']['should_optimize']
                if optimizable == True:
                    memoryUpdater['practice_logs_analysis'][i]['optimizer_signal']['should_optimize'] = False

            saveAiMemory(user_id, memoryUpdater)
            print(f"Signal cleared for {file}")

    print("===OPTIMIZER OUTPUT===")
    print(opt)


def try_dispatch_optimizer(file):
    memory = loadAiMemory(file[:-5])

    if not memory.get('practice_logs_analysis'):
        print("No analysis has been done yet.")
        return

    latest_analysis = memory['practice_logs_analysis'][-1]

    if not latest_analysis.get('optimizer_signal'):
        print("No analysis signal to work with.")
        return

    optimizer_signal = latest_analysis['optimizer_signal']

    status = optimizer_signal.get('should_optimize')

    if str(status).lower() == 'true' and optimizer_signal['confidence'] >= 0.85:
        run_optimizer(file)
    elif str(status).lower() == 'true' and optimizer_signal['confidence'] < 0.85:
        print(f"Not yet Ready, timestamp: {current_time.now()}")
    elif str(status).lower() == 'false' and optimizer_signal['confidence'] >= 0.85:
        print(f"Not yet Ready, timestamp: {current_time.now()}")
    elif str(status).lower() == 'false' and optimizer_signal['confidence'] < 0.85:
        print(f"Not yet Ready, timestamp: {current_time.now()}")


def optimizer_dispatcher():
    if not memoryPath.exists() or not memoryPath.is_dir():
        print(
            f"⚠️ [WARNING]: Directory not found at {memoryPath.absolute()}. Skipping optimization.")
        return  # Exit the function safely

    try:
        for user_file in memoryPath.iterdir():
            if user_file.is_file():
                print(user_file.name)
                try_dispatch_optimizer(user_file.name)
    except Exception as e:
        print(f"❌ [ERROR]: An error occurred during dispatch: {e}")


def call_gemini(prompt: str, payload: dict) -> dict:
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=json.dumps({
                "system_prompt": prompt,
                "input": payload
            })
        )

        return json.loads(response.text)

    except ClientError as e:
        raise RuntimeError(
            f"Gemini API error: {e['error']['code'] + e['error']['message']}")

    except json.JSONDecodeError:
        raise ValueError("AI response is not valid JSON")


def call_gemini_for_deeper_reasoning(prompt: str, payload: dict) -> dict:

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=json.dumps({
                "system_prompt": prompt,
                "input": payload
            }),
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_level="high")
            )
        )

        return json.loads(response.text)

    except ClientError as e:
        raise RuntimeError(f"Gemini API error: {e}")

    except json.JSONDecodeError:
        raise ValueError("AI response is not valid JSON")


def call_gemini_with_retry(prompt, payload, deeper=False, retries=3, delay=5) -> dict:
    for attempt in range(retries):
        try:
            if deeper:
                return call_gemini_for_deeper_reasoning(prompt, payload)
            else:
                return call_gemini(prompt, payload)
        except ServerError as e:
            if '503' in str(e):
                print(
                    f"Server busy, retrying in {delay} seconds... (Attempt {attempt+1})")
                time.sleep(delay)
            else:
                raise e
    raise RuntimeError("Gemini server busy, max retries reached.")


def session_exists(session_id):
    return os.path.exists(f"{AI_MEMORY_DIR}/{session_id}.json")


def create_session():
    session_id = str(uuid.uuid4())
    createAiMemory(session_id)
    return session_id


def createAiMemory(session_id):
    os.makedirs(AI_MEMORY_DIR, exist_ok=True)

    memory = {
        "session_id": session_id,
        "created_at": current_time.now().isoformat(),
        "skill": {},
        "current_strategy": None,
        "practice_logs": [],
        "practice_logs_analysis": [],
        "strategy_history": [],
        "agent_insights": {
            "version": 1,
            "insights": None
        },
        "optimizer_state": {
            "last_run_at": None,
            "cooldown_days": 3,
            "times_optimized": 0
        },
        "timeline": [
            {
                "id": str(uuid.uuid1()),
                "event": "session_created",
                "actor": "system",
                "timestamp": current_time.now().isoformat(),
                "title": "Session Created",
                "summary": "Your learning journey started here.",
                "details": {
                    "reason": "User initiated a new learning session.",
                    "changes": {},
                    "evidence": []
                },
                "visibility": {
                    "show_on_timeline": True,
                    "clickable": False
                }
            }
        ],
        "meta": {
            "agent_version": "forge-v1",
            "last_analyzed": None,
        },
        "normalized_return": {
            "normalized_input": {},
            "normalized_strategy": {}
        }
    }
    with open(f"{AI_MEMORY_DIR}/{session_id}.json", "w") as f:
        json.dump(memory, f, indent=4)


def loadAiMemory(session_id):
    with open(f"{AI_MEMORY_DIR}/{session_id}.json", "r") as f:
        return json.load(f)


def saveAiMemory(session_id, memory):
    with open(f"{AI_MEMORY_DIR}/{session_id}.json", "w") as f:
        json.dump(memory, f, indent=4)


def getDecisionStrategy(raw_decision: dict) -> dict:
    return call_gemini_with_retry(
        prompt=forge_decision_architect_prompt,
        payload=raw_decision
    )


def getLevel(level: int) -> str:
    levels = {
        0: "novice",
        1: "beginner",
        2: "intermediate",
        3: "advanced",
        4: "expert"
    }
    return levels.get(level, -1)


def build_narration_payload(normalized_input: dict, strategy: dict, agent_insights: str = None, agent_available: bool = False, agent_version: int = 1) -> dict:
    total_cycles = strategy['practice_cycles']
    cycles = []
    for cycle in total_cycles:
        cycles.append({
            "current_cycle_index": cycle['cycle_index'],
            "current_phase": {
                "title": cycle['focus_summary'],
                "weeks": cycle['duration_weeks'],
                "why_this_phase": (
                    cycle['short_explanation_for_cycle'],
                )
            },
            "this_week_plan": {
                "primary": {
                    "task": "Main Practice Activity",
                    "details": cycle['weekly_loop']['primary_activity'],
                },
                "secondary": {
                    "task": "Secondary Practice Activity",
                    "details": cycle['weekly_loop']['secondary_activity'],
                }
            },
            "what_to_focus_on": [
                f"You will start with {cycle['difficulty_profile']['comfortable']} "
                f"and gradually work towards {cycle['difficulty_profile']['challenging']}."
            ],
        })

    return {
        "static": {
            "goal_summary": (
                f"You are learning {normalized_input['skill_name']} "
                f"starting at {getLevel(normalized_input['current_level'])} level "
                f"towards {getLevel(normalized_input['target_level'])} level "
                f"with an average of {normalized_input['weekly_time_hours']} hours per week."
            ),
            "learning_philosophy": (
                f"The plan favours {normalized_input['constraints']['learning_style']} "
                "learning style and paying attention to what works and what doesn't "
                f"while managing a {normalized_input['constraints']['dropout_risk']} risk of dropping out."
            )
        },
        "dynamic": cycles,
        "agent_available": agent_available,
        "agent_insights": agent_insights,
        "agent_version": agent_version
    }


def storeSummary(summary: dict) -> dict:
    summaryLife.update(summary)
    return summaryLife


def callAnalyzer(session_id: str) -> dict:
    memory = loadAiMemory(session_id)
    countLogs = memory['practice_logs'].__len__()
    if countLogs % 3 == 0:
        # practice_sessions = memory['practice_logs'][-3:]
        return call_gemini_with_retry(
            prompt=forge_analyzer,
            payload={
                "practice_session": memory['practice_logs'][-3:],
                "current_strategy_snapshot": memory['current_strategy']
            },
            deeper=True
        )
    else:
        return {}


def callOptimizer(session_id: str) -> dict:
    if not session_exists(session_id):
        return {"status": "error", "message": "Session doesn't exist"}
    memoryRaw = loadAiMemory(session_id)

    normalized_strategy = memoryRaw['normalized_return']['normalized_strategy']
    practice_logs_analysis = memoryRaw['practice_logs_analysis']
    # timeline = memoryRaw['timeline']
    optimizer_state = memoryRaw.get('optimizer_state', {})

    if not optimizer_state:
        memoryRaw['optimizer_state'] = {
            "last_run_at": None,
            "cooldown_days": 3,
            "times_optimized": 0
        }
        saveAiMemory(session_id, memoryRaw)
    memory = loadAiMemory(session_id)

    optimizer_state = memory.get('optimizer_state', {})

    eligible_batches = []
    for analysis in practice_logs_analysis:
        signal = analysis.get("optimizer_signal", {})
        if signal.get("should_optimize") and signal.get("confidence", 0) >= 0.85:
            eligible_batches.append(analysis)
    if len(eligible_batches) < 2:
        return {"status": "skipped",
                "reason": "insufficient_evidence",
                "eligible_batches": len(eligible_batches),
                "required_batches": 2
                }

    optimizer_payload = {
        "current_strategy": normalized_strategy,
        "strategy_history": memory.get("strategy_history", []),
        "analytics_summary": summaryLife if summaryLife else {},
        "analytics_batches": eligible_batches
    }

    optimizer_result = call_gemini_with_retry(
        prompt=forge_optimizer,
        payload=optimizer_payload,
        deeper=True
    )

    # Strategy not adjusted
    if optimizer_result['decision'] == "no_change":
        memory['timeline'].append({
            "id": str(uuid.uuid1()),
            "event": "strategy_reviewed",
            "actor": "ai",
            "timestamp": current_time.now().isoformat(),
            "title": "Strategy Reviewed",
            "summary": "Strategy reviewed; no change required."
        })
        saveAiMemory(session_id, memory)
        return {"status": "no_change"}

    # Strategy adjusted safely
    elif optimizer_result['decision'] == "strategy_adjusted" and float(optimizer_result['confidence']) >= 0.85:
        memory['strategy_history'].append({
            "version": memory['normalized_return']['normalized_strategy']['strategy_version'],
            "ended_at": current_time.now().isoformat(),
            "reason": "Optimizer revision"
        })
        memory['normalized_return']['normalized_strategy'] = optimizer_result['new_strategy']
        memory['current_strategy']['practice_cycles'] = optimizer_result['new_strategy']['practice_cycles']
        memory['current_strategy']['evaluation_metrics'] = optimizer_result['new_strategy']['evaluation_metrics']
        memory['current_strategy']['architect_notes'] = optimizer_result['new_strategy']['architect_notes']

        memory["timeline"].append({
            "id": str(uuid.uuid1()),
            "event": "strategy_adjusted",
            "actor": "ai",
            "timestamp": current_time.now().isoformat(),
            "title": "Practice Strategy Adjusted",
            "summary": "Practice strategy adjusted due to overload signals.",
            "details": optimizer_result["change_summary"]
        })
        memory["optimizer_state"]["last_run_at"] = current_time.now().isoformat(),
        memory["optimizer_state"]["times_optimized"] += 1
        memory["agent_insights"]["version"] += 1
        memory["agent_insights"]["insights"] = optimizer_result["reasoning"]
        saveAiMemory(session_id, memory)
        return {"status": "optimized"}
    # return {}


# API ROUTES
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200


@app.route('/api/create_session', methods=['GET'])
def createSession():
    session_id = create_session()
    return jsonify({"session_id": session_id}), 201


@app.route('/api/auth/login', methods=['POST'])
def login_session():
    session_id = request.json.get('session_Id')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)
    memory['timeline'].append({
        "id": str(uuid.uuid1()),
        "event": "logged_in",
        "actor": "user",
        "timestamp": current_time.now().isoformat(),
        "title": "Logged in to continue forging",
        "summary": f"User logged in to continue the skill: {[memory['skill']['name']]}.",
        "details": {
            "reason": "Session_id provided to continue forging.",
            "changes": {},
            "evidence": [
                f"Skill: {memory['skill']['name']}",
                f"Experience Level: {memory['skill']['level']}",
            ]
        },
        "visibility": {
            "show_on_timeline": True,
            "clickable": False
        }
    })

    return jsonify({
        "status": "success",
        "message": "Session Found!"
    }), 200


@app.route('/api/decision/new', methods=['POST'])
def new_decision():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    decision_data = request.json.get('decision_Data')
    if not decision_data:
        return jsonify({"error": "No decision data provided"}), 400

    try:
        ai_result = getDecisionStrategy(decision_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    memory = loadAiMemory(session_id)

    memory['skill'] = {
        "name": decision_data.get('goal'),
        "level": decision_data.get('currentLevel'),
        "targetLevel": decision_data.get('goalLevel'),
        "weekly_time_hours": decision_data.get('timeCommitment')
    }

    memory['current_strategy'] = ai_result['strategy']

    memory['strategy_history'].append({
        "version": len(memory['strategy_history']) + 1,
        "reason": "Initial strategy",
        "created_at": current_time.now().isoformat()
    })

    memory['timeline'].append({
        "id": str(uuid.uuid1()),
        "event": "initial_strategy_created",
        "actor": "ai",
        "timestamp": current_time.now().isoformat(),
        "title": "Initial Practice Strategy Created",
        "summary": f"Initial practice strategy created for {[memory['skill']['name']]}.",
        "details": {
            "reason": "Sufficient information provided to create initial practice system.",
            "changes": {
                "strategy_version": len(memory['strategy_history'])
            },
            "evidence": [
                f"Skill: {memory['skill']['name']}",
                f"Experience Level: {memory['skill']['level']}",
            ]
        },
        "visibility": {
            "show_on_timeline": True,
            "clickable": True
        }
    })

    memory['normalized_return']['normalized_input'] = ai_result['normalized_input']
    memory['normalized_return']['normalized_strategy'] = ai_result['strategy']

    saveAiMemory(session_id, memory)

    user_email = decision_data.get('userEmail')
    if user_email:
        # 1. Send the first month's invite immediately
        bodyOfEmail = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2e7d32;">Ready to Forge your skills?</h2>
                <p>We've created a custom practice strategy for <strong>{memory['normalized_return']['normalized_input']['skill_name']}</strong>.</p>
                <p>To help you stay consistent, we've attached a <strong>Recurring Calendar Invite</strong> for the month.</p>
                <p><strong>Action:</strong> Open the attached 'invite.ics' file and click "Add to Calendar". 
                It will automatically set a reminder for you <strong>every 4 days</strong>.</p>
                <br>
                <p>Stay sharp,<br>Forge Agent</p>
            </body>
            </html>
            """
        email_thread = threading.Thread(
            target=send_smart_calendar_invite,
            args=(user_email,
                  memory['normalized_return']['normalized_input']['skill_name'],
                  bodyOfEmail)
        )
        email_thread.daemon = True
        email_thread.start()

        # 2. Schedule the NEXT email for 30 days from now with the follow-up agent
        job_id = f"monthly_update_{user_email}"
        scheduler.add_job(id=job_id,
                          func=monthly_follow_up_agent,
                          trigger='interval',
                          minutes=2,  # Runs every month (Change it later)
                          args=[user_email, memory['normalized_return']
                                ['normalized_input']['skill_name']],
                          replace_existing=True,
                          max_instances=3, # Change later
                          misfire_grace_time=3600
                          )

    return jsonify({"response": "Strategy Created Successfully and Reminders Set!",
                    "status": "success"}), 201


@app.route('/api/decision/get', methods=['GET'])
def get_narration():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)
    if not memory['normalized_return']['normalized_input']:
        return jsonify({
            "error": "User hasn't created a practice plan"
        }), 400
    agent_insights_available = False
    if memory['agent_insights']['insights']:
        agent_insights_available = True

    narration = build_narration_payload(
        memory['normalized_return']['normalized_input'],
        memory['normalized_return']['normalized_strategy'],
        memory['agent_insights']['insights'],
        agent_insights_available,
        memory['agent_insights']['version']
    )
    return jsonify(narration), 200


@app.route('/api/timeline', methods=['GET'])
def get_timeline():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)

    timeline = sorted(
        memory['timeline'],
        key=lambda x: x['timestamp']
    )

    for item in timeline:
        dt_obj = datetime.fromisoformat(item['timestamp'])
        item['displayTime'] = dt_obj.strftime("%B %d, %Y at %I:%M %p")

    return jsonify({
        "timeline": timeline
    }), 200


@app.route('/api/practice/new', methods=['POST'])
def log_practice():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    practice_data = request.json.get('logSessionData')
    if not practice_data:
        return jsonify({"error": "No practice data provided"}), 400

    memory = loadAiMemory(session_id)

    if not memory['skill']:
        return jsonify({"error": "No strategy has been created"}), 400

    memory['practice_logs'].append({
        "date": current_time.now().isoformat(),
        "activity": practice_data.get('focusContent'),
        "duration_minutes": practice_data.get('duration'),
        "difficulty_rating": practice_data.get('difficulty'),
        "fatigue_level": practice_data.get('fatigueLevel'),
    })

    memory['timeline'].append({
        "id": str(uuid.uuid1()),
        "event": "practice_session_logged",
        "actor": "user",
        "timestamp": current_time.now().isoformat(),
        "title": "Practice Session Logged",
        "summary": f"Logged practice session for {memory['skill']['name']}.",
        "details": {
            "reason": "User logged a new practice session.",
            "changes": {
                "practice_log_count": len(memory['practice_logs'])
            },
            "evidence": [
                f"Activity: {practice_data.get('activity')}",
                f"Difficulty Rating: {practice_data.get('difficulty_rating')}",
            ]
        },
        "visibility": {
            "show_on_timeline": True,
            "clickable": True
        }
    })

    saveAiMemory(session_id, memory)
    geminiAnalysis = callAnalyzer(session_id)

    if not geminiAnalysis:
        return jsonify({
            "response": "Practice log created successfully",
            "status": "success"
        }), 201

    memory = loadAiMemory(session_id)
    memory['practice_logs_analysis'].append(geminiAnalysis)
    memory['timeline'].append({
        "id": str(uuid.uuid1()),
        "event": "session_analyzed",
        "actor": "ai",
        "timestamp": current_time.now().isoformat(),
        "title": "Practice Session Analyzed",
        "summary": "Analyzed 3 consecutive practice sessions",
        "details": {
            "reason": "User logged up to 3 practice sessions.",
            "changes": {
                "analysis_count": len(memory['practice_logs_analysis'])
            },
            "evidence": [
                f"Challenge Alignment: {geminiAnalysis['session_analysis']['challenge_alignment']}",
                f"Analyzer Confidence: {geminiAnalysis['analysis_confidence']}"
            ]
        },
        "visibilty": {
            "show_on_timeline": True,
            "clickable": True
        }
    })
    saveAiMemory(session_id, memory)

    return jsonify({"response": "Practice log created and analyzed successfully",
                    "status": "success"}), 201


@app.route('/api/practice/logs', methods=['GET'])
def get_practice_logs():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)
    practice_memory = memory['practice_logs']

    practices = []
    for practice_log in practice_memory:
        formattedTime = datetime.fromisoformat(
            practice_log['date']).strftime("%B %d, %Y at %I:%M %p")
        practices.append({
            "date": formattedTime,
            "focusContent": practice_log['activity'],
            "duration": practice_log['duration_minutes'],
            "difficulty": practice_log['difficulty_rating'],
            "fatigueLevel": practice_log['fatigue_level']
        })

    return jsonify(practices), 200


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)

    practice_logs = memory.get("practice_logs", [])
    analyses = memory.get("practice_logs_analysis", [])

    # -----------------------------
    # 1. Build per-session analytics
    # -----------------------------
    session_metrics = []

    for idx, log in enumerate(practice_logs):
        session_metrics.append({
            "session_index": idx,
            "date": log['date'],
            "duration_minutes": int(log['duration_minutes']),
            "difficulty_rating": int(log['difficulty_rating']),
            "fatigue_level": int(log['fatigue_level'])
        })

    dateCounts = []
    counts = Counter(item['date'] for item in practice_logs)
    for date, number in counts.items():
        dateCounts.append({
            "date": date[:10],
            "number": number
        })

    # Duration
    durationSum = defaultdict(lambda: {"total_dur": 0, "count": 0})
    for entry in practice_logs:
        dates = entry.get("date")
        dur = int(entry.get("duration_minutes"))
        durationSum[dates[:10]]["total_dur"] += dur
        durationSum[dates[:10]]["count"] += 1
    durationCounts = []
    for dat, duration in durationSum.items():
        durationCounts.append({
            "date": dat,
            "duration": duration["total_dur"] / duration["count"]
        })

    # Difficulty
    difficultySum = defaultdict(lambda: {"total_diff": 0, "count": 0})
    for entryDiff in practice_logs:
        datesDiff = entryDiff.get("date")
        diff = int(entryDiff.get("difficulty_rating"))
        difficultySum[datesDiff[:10]]["total_diff"] += diff
        difficultySum[datesDiff[:10]]["count"] += 1
    difficultyCounts = []
    for datDiff, difficulty in difficultySum.items():
        difficultyCounts.append({
            "date": datDiff,
            "difficulty": difficulty["total_diff"] / difficulty["count"]
        })
    # print(difficultyCounts)

    # Fatigue
    fatigueSum = defaultdict(lambda: {"total_fat": 0, "count": 0})
    for entryFat in practice_logs:
        datesFat = entryFat.get("date")
        fat = int(entryFat.get("fatigue_level"))
        fatigueSum[datesFat[:10]]["total_fat"] += fat
        fatigueSum[datesFat[:10]]["count"] += 1
    fatigueCounts = []
    for datFat, fatigue in fatigueSum.items():
        fatigueCounts.append({
            "date": datFat,
            "fatigue": fatigue["total_fat"] / fatigue["count"]
        })

    # ----------------------------------------
    # 2. Build analysis batches with scope
    # ----------------------------------------
    analysis_batches = []
    mappings = {
        "session_to_analysis": {},
        "analysis_to_sessions": {}
    }

    for analysis_idx, analysis in enumerate(analyses):
        # Analyzer always runs on last 3 sessions
        end_idx = (analysis_idx + 1) * 3
        start_idx = end_idx - 3
        session_indices = list(range(start_idx, end_idx))

        batch_id = f"analysis_{analysis_idx + 1}"

        analysis_batches.append({
            "analysis_id": batch_id,
            "analysis_version": analysis["analysis_version"],
            "covers_sessions": session_indices,
            "effort_level": analysis["session_analysis"]["effort_level"],
            "challenge_alignment": analysis["session_analysis"]["challenge_alignment"],
            "flags": analysis["flags"],
            "confidence": analysis["analysis_confidence"],
            "notes": analysis["analysis_notes"]
        })

        mappings['analysis_to_sessions'][batch_id] = session_indices

        for s_idx in session_indices:
            mappings['session_to_analysis'].setdefault(
                s_idx, []).append(batch_id)

    # ----------------------------------------
    # 3. Compute high-level summary stats
    # ----------------------------------------
    if session_metrics:
        avg_difficulty = sum(s["difficulty_rating"]
                             for s in session_metrics) / len(session_metrics)
        avg_fatigue = sum(s["fatigue_level"]
                          for s in session_metrics) / len(session_metrics)
    else:
        avg_difficulty = 0
        avg_fatigue = 0

    overload_flags = [
        a["flags"]["overload_risk"]
        for a in analyses
    ]

    summary = {
        "total_sessions": len(practice_logs),
        "total_analyses": len(analyses),
        "average_difficulty": round(avg_difficulty, 2),
        "average_fatigue": round(avg_fatigue, 2),
        "overload_detected": any(overload_flags)
    }

    storeSummary(summary)

    # ----------------------------------------
    # 4. Final analytics payload
    # ----------------------------------------
    return jsonify({
        "sessions": session_metrics,
        "summary": summary,
        "dateCounts": dateCounts,
        "durationCounts": durationCounts,
        "difficultyCounts": difficultyCounts,
        "fatigueCounts": fatigueCounts
    }), 200


@app.route('/api/reminders/stop', methods=['GET'])
def stop_reminders():
    user_email = request.args.get('email')

    if not user_email:
        return "Email missing", 400

    found_any = False

    # We look through ALL jobs currently in the scheduler's memory/store
    for job in scheduler.get_jobs():
        if user_email in job.id:
            try:
                scheduler.remove_job(job.id)
                found_any = True
            except:
                pass

    if found_any:
        return render_template_string("""
            <body style="text-align:center; font-family:sans-serif; padding-top:50px;">
                <h1 style="color:#2e7d32;">Successfully Unsubscribed</h1>
                <p>Forge Agent has cleared all practice reminders for <strong>{{email}}</strong>.</p>
                <a href="https://forge2ai.vercel.app" style="color:#2e7d32;">Back to Forge</a>
            </body>
        """, email=user_email), 200
    else:
        return render_template_string("""
            <body style="text-align:center; font-family:sans-serif; padding-top:50px;">
                <h1 style="color:#666;">No Active Reminders</h1>
                <p>We couldn't find any active reminders for {{email}}. You're already all clear!</p>
                <a href="https://forge2ai.vercel.app">Back to Forge</a>
            </body>
        """, email=user_email), 200


# SCHEDULER JOBS
scheduler.add_job(id='dispatch_optimizer',
                  func=optimizer_dispatcher,
                  trigger='interval',
                  minutes=1,
                  max_instances=1,  # Ensures only one dispatcher runs at a time
                  replace_existing=True
                  )


scheduler.add_job(id='ping_server',
                  func=continuous_ping,
                  trigger='interval',
                  minutes=10,
                  max_instances=1,  # Ensures only one dispatcher runs at a time
                  replace_existing=True
                  )


scheduler.start()

print("📅 Scheduler started with persisted job store")
print(scheduler.get_jobs())


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
