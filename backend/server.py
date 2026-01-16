from asyncio import exceptions
from flask import Flask, request, jsonify
from flask_apscheduler import APScheduler
from flask_cors import CORS
from google import genai
from google.genai.errors import ClientError
from dotenv import load_dotenv
import uuid
import json
import datetime
import os
# import asyncio

load_dotenv()

client = genai.Client()

app = Flask(__name__)
CORS(app)

scheduler = APScheduler()
current_time = datetime.datetime.now()

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
        "duration_weeks": "number",
        "focus_summary": "string",
        "short_explanation": "string",
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
  }
}

Output STRICT JSON only.


"""

forge_analyzer = """
You are FORGE-ANALYZER.

Your role is to analyze individual practice sessions.

You detect:
- Friction
- Overload
- Under-challenge
- Emotional interference

You do NOT change the strategy.
You only observe and classify.

You collect the following information after each practice session:
- Practice session data:
    - Activity
    - Difficulty (1–5)
    - Reflection notes
- Current Strategy Summary:
    - Strategy snapshot

You output the following:
- session_analysis: 
    - effort_level,
    - challenge_alignment,
    - friction_signals,
    - positive_signals
- flags
- confidence_score in your analysis (0–1)

Remain neutral and evidence-focused.
"""

forge_optimizer = """
You are FORGE-OPTIMIZER.

You reason over time.

Your task:
- Compare intended practice vs actual behavior
- Detect improvement, stagnation, or regression
- Rewrite the practice strategy if needed

You collect the following information:
- Original Strategy
- Current Strategy
- Practice Session Analyses over time as practice logs
- Previous Strategy Adjustments as optimizations

You output the following:
- strategy_adjustment:
    - changes_made:
        - structure_changes
        - intensity_changes
        - focus_changes
    - New weekly structure
- Reasoning
- Confidence level
- Risk Notes

You are allowed to modify structure, intensity, and focus.
You must justify every change.

You think like a coach AND a scientist.

"""

forge_plateau_detector = """
You are FORGE-META.

You analyze long-term patterns across decisions.

Your role:
- Detect plateaus
- Detect strategy drift
- Identify false progress

You do NOT propose detailed routines.
You recommend directional shifts only.

You accept the following inputs:
- The full history of the timeline
- And the currect strategy being applied to help the user in his/ her journey.

You output the following:
- Trajectory Status (improving, plateaued, declining)
- Detected patterns
- Recommended Directional Shift (if any)
- Confidence Level (0–1)

"""

# GLOBAL VARIABLES
AI_MEMORY_DIR = "AI_Memory"

# UTILITY FUNCTIONS


def printer():
    print("Scheduled task executed.")


def call_gemini(prompt: str, payload: dict) -> dict:

    # await asyncio.sleep(0.6) # To avoid rate limits

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=json.dumps({
                "system_prompt": prompt,
                "input": payload
            })
        )

        return json.loads(response.text)

    # except exceptions.ResourceExhausted:
    #     print("Quota hit! Sleeping for 35 seconds...")
    #     await asyncio.sleep(35)  # Wait for the window to reset
    #     return await call_gemini(prompt, payload)  # Retry

    except ClientError as e:
        raise RuntimeError(f"Gemini API error: {e}")

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
        "created_at": current_time.isoformat(),
        "skill": {},
        "current_strategy": None,
        "practice_logs": [],
        "strategy_history": [],
        "agent_insights": {},
        "timeline": [
            {
                "id": str(uuid.uuid1()),
                "event": "session_created",
                "actor": "system",
                "timestamp": current_time.isoformat(),
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
            # "next_scheduled_review": None,
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
    return call_gemini(
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


def build_narration_payload(normalized_input: dict, strategy: dict) -> dict:
    total_cycles = strategy['practice_cycles']
    cycles = []
    for cycle in total_cycles:
        cycles.append({
            "current_phase": {
                "title": cycle['focus_summary'],
                "weeks": cycle['duration_weeks'],
                "why_this_phase": (
                    cycle['short_explanation'],
                )
            },
            "this_week_plan": [
                {
                    "task": "Main Practice Activity",
                    "details": cycle['weekly_loop']['primary_activity'],
                },
                {
                    "task": "Secondary Practice Activity",
                    "details": cycle['weekly_loop']['secondary_activity'],
                }
            ],
            "what_to_focus_on": [
                cycle['difficulty_profile']['challenging'],
            ],
            "how_to_measure_progress": [
                cycle['success_markers']['objective']
                + cycle['success_markers']['subjective']
            ]
        })

    return {
        "static": {
            "goal_summary": (
                f"You are learning {normalized_input['skill_name']},"
                f"starting at {getLevel(normalized_input['current_level'])} level, "
                f"towards {getLevel(normalized_input['target_level'])} level, "
                f"with an average of {normalized_input['weekly_time_hours']} hours per week."
            ),
            "learning_philosophy": (
                f"The plan favours a {normalized_input['constraints']['learning_style']} "
                "learning style and paying attention to what works and what doesn't "
                f"while managing a {normalized_input['constraints']['dropout_risk']} risk of dropping out."
            )
        },
        "dynamic": cycles
    }

# API ROUTES


@app.route('/api/create_session', methods=['GET'])
def createSession():
    session_id = create_session()
    return jsonify({"session_id": session_id}), 201


@app.route('/api/show_session', methods=['GET'])
def show_session():
    session_id = request.headers.get('X-Session-ID')
    if session_exists(session_id) == False:
        return jsonify({"error": "Session not found"}), 401
    return jsonify(loadAiMemory(session_id)), 200


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
        "created_at": current_time.isoformat()
    })

    memory['timeline'].append({
        "id": str(uuid.uuid1()),
        "event": "initial_strategy_created",
        "actor": "ai",
        "timestamp": current_time.isoformat(),
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

    return jsonify({"response": "Strategy Created Successfully",
                    "status": "success"}), 201


@app.route('/api/decision/get', methods=['GET'])
def get_narration():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)

    narration = build_narration_payload(
        memory['normalized_return']['normalized_input'],
        memory['normalized_return']['normalized_strategy']
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

    return jsonify({
        "timeline": timeline
    }), 200


@app.route('/api/practice/new', methods=['POST'])
def log_practice():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    practice_data = request.json.get('practice_data')
    if not practice_data:
        return jsonify({"error": "No practice data provided"}), 400

    memory = loadAiMemory(session_id)

    memory['practice_logs'].append({
        "date": current_time.isoformat(),
        "activity": practice_data.get('focusContent'),
        "duration_minutes": practice_data.get('duration'),
        "difficulty_rating": practice_data.get('difficulty'),
        "fatigue_level": practice_data.get('fatigueLevel'),
        # "reflection": practice_data.get('reflection'),
        # "analysis": {
        #     "effort_level": practice_data.get('effort_level'),
        #     "friction": practice_data.get('friction')
        # }
    })

    memory['timeline'].append({
        "id": str(uuid.uuid1()),
        "event": "practice_session_logged",
        "actor": "user",
        "timestamp": current_time.isoformat(),
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

    countLogs = loadAiMemory(session_id)['practice_logs'].__len__()
    count = False
    if countLogs % 3 == 0:
        count = True

    return jsonify({"response": "Practice log created successfully",
                    "status": "success",
                    "count": count}), 201


@app.route('/api/practice/logs', methods=['GET'])
def get_practice_logs():
    session_id = request.headers.get('X-Session-ID')
    if not session_exists(session_id):
        return jsonify({"error": "Session not found"}), 401

    memory = loadAiMemory(session_id)
    practice_memory = memory['practice_logs']

    practices = []
    for practice_log in practice_memory:
        practices.append({
            "date": practice_log['date'],
            "activity": practice_log['activity'],
            "difficulty_rating": practice_log['difficulty_rating'],
            "reflection": practice_log['reflection']
        })

    return jsonify({
        "practice_logs": practices
    }), 200


if __name__ == '__main__':
    # scheduler.add_job(id='Scheduled Task', func=printer, trigger='interval', seconds=30)
    scheduler.start()
    app.run(debug=True)


# 🧬 FULL SESSION MEMORY SCHEMA(V1)
# {
#     "session_id": "7f3c2d...",
#   "created_at": "2025-07-01T10:12:00Z",
#   "skill": {
#       "name": "Jazz Piano",
#     "level": "Beginner",
#     "weekly_time_hours": 5
#   },

#     "current_strategy": {
#       "version": 3,
#       "weekly_structure": {},
#     "focus_distribution": {},
#     "difficulty_level": "moderate",
#     "generated_at": "2025-07-14"
#   },

#     "practice_logs": [
#       {
#           "date": "2025-07-10",
#           "activity": "Left-hand comping",
#           "difficulty_rating": 4,
#           "reflection": "Struggled with timing",
#           "analysis": {
#               "effort_level": "high",
#               "friction": ["timing instability"]
#           }
#       }
#   ],

#     "strategy_history": [
#       {
#           "version": 1,
#           "reason": "Initial strategy",
#           "created_at": "2025-07-01"
#       },
#       {
#           "version": 2,
#           "reason": "Increased difficulty after under-challenge",
#           "created_at": "2025-07-07"
#       }
#   ],

#     "agent_insights": {
#       "detected_patterns": [],
#       "plateau_flags": [],
#     "confidence_trend": []
#   },

#     "timeline": [
#       {
#           "event": "strategy_revision",
#           "timestamp": "2025-07-07",
#           "summary": "Adjusted focus toward rhythm stability"
#       }
#   ],

#     "meta": {
#       "last_analyzed": "2025-07-14",
#       "next_scheduled_review": "2025-07-21",
#     "agent_version": "forge-v1"
#   }
# }
