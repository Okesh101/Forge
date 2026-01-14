from asyncio import exceptions
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai.errors import ClientError
from dotenv import load_dotenv
import uuid
import json
import datetime
import os
import asyncio

load_dotenv()

client = genai.Client()

app = Flask(__name__)
CORS(app)

current_time = datetime.datetime.now()

# AI PROMPTS
forge_decision_architect_prompt = """
You are FORGE-DECISION-ARCHITECT.

Your role is to design a practice system for long-term skill mastery.

You do NOT motivate.
You do NOT give generic advice.
You do NOT optimize for speed.
You do NOT speak with an authoritative tone.

You decompose skills into trainable components.
You think in weeks, not days.
You balance focus between core and supporting components.
You balance difficulty between comfortable and challenging.
You create evaluation metrics that capture both subjective and objective progress.
You speak like a practice architect, NOT too formal, NOT too casual.
You speak like you are in the shoes of a learner planning their own practice.
You design practice loops that can be evaluated over time.

You collect the following information:
- Skill name
- Current proficiency level
- Target proficiency level
- Available weekly time

Your task:
1. Normalize raw human input into a precise machine-readable specification.
2. Design an initial practice strategy for long-term skill mastery.

Rules:
- Do not remove nuance from user input.
- Explicitly mark inferred data.
- Output STRICT JSON only.
- No commentary outside JSON.

Output schema:
{
  "meta": {...},
  "normalized_input": {...},
  "strategy": {...}
}

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

forge_narrator = """
You are FORGE-NARRATOR.

You explain system changes to humans.

You do NOT simplify away meaning.
You do NOT sound motivational.

You accept the changes made to the practice strategy by the system and the reasoning behind them.
You output a clear explanation for the user in human-friendly language.

Explain clearly and calmly.

"""

# forge_normalize_input = """
# You are FORGE-INTERPRETER.

# Your task is to translate raw human input into a clear, expanded,
# machine-friendly specification for downstream reasoning systems.

# You do NOT add assumptions.
# You do NOT redesign the task.
# You ONLY clarify intent, context, scope, and constraints.

# If information is missing, infer cautiously and mark it as inferred.

# Your output will be used by another AI system.
# Clarity and completeness are critical.

# """

# forge_normalize_output = """
# You are FORGE-REFINER.

# Your role is to translate internal system outputs into frontend-ready structures that can be portrayed on the frontend screen and look beautiful.

# You do NOT change meaning, you ONLY refine it to be better understood by the user.
# You do NOT add advice, you ONLY give clarity and remove ambiguity.
# You preserve structure but improve clarity.
# You CAN only when needed tweak structure for better readability.
# You CAN expand terse points into full sentences for better readability.
# You MUST explain any technical terms in simple language for user to understand.
# You also collect the initial input passed down from the normalizer that turned the real user input into a machine-friendly format to provide context.

# Your outputs must be:
# - Human-readable
# - Frontend-friendly
# - Clearly segmented
# You MUST return your output in a JSON format for better readability and one that can be parsed into a json.loads() function.

# """

# GLOBAL VARIABLES
AI_MEMORY_DIR = "AI_Memory"

# UTILITY FUNCTIONS


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
                "event": "session_created",
                "timestamp": current_time.isoformat(),
                "summary": "AI memory session created."
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


def build_narration_payload(normalized_input: dict, strategy: dict) -> dict:
    phases = list(strategy['practice_roadmap'].values())
    current_phase = phases[0]

    return {
        "goal_summary": (
            f"You are learning {normalized_input['skill_name']},"
            f"starting at {normalized_input['current_proficiency']} level, "
            f"with about {normalized_input['available_weekly_time']} each week."
        ),
        "learning_philosophy": (
            f"You will improve through {normalized_input['constraints']['learning_style']} "
            "and paying attention to what works and what doesn't."
        ),
        "current_phase": {
            "title": current_phase['focus'],
            "why_this_phase": (
                "This phase builds the basic skills needed before moving to more complex tasks."
            )
        },
        "this_week_plan": [
            {
                "task": "Main Practice Activity",
                "details": current_phase['primary_loop']
            }
        ],
        "what_to_focus_on": [
            current_phase['difficulty_balance']
        ],
        "how_to_measure_progress": [
            current_phase['milestone']
        ]
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
        "name": decision_data.get('skillOrHabit'),
        "level": decision_data.get('currentLevel'),
        "weekly_time_minutes": decision_data.get('timeCommitment')
    }

    memory['current_strategy'] = ai_result['strategy']

    memory['strategy_history'].append({
        "version": len(memory['strategy_history']) + 1,
        "reason": "Initial strategy",
        "created_at": current_time.isoformat()
    })

    memory['timeline'].append({
        "event": "initial_strategy_created",
        "timestamp": current_time.isoformat(),
        "summary": f"Initial practice strategy created for {[memory['skill']['name']]}."
    })

    memory['normalized_return']['normalized_input'] = ai_result['normalized_input']
    memory['normalized_return']['normalized_strategy'] = ai_result['strategy']

    saveAiMemory(session_id, memory)

    return jsonify({"response": "Strategy Created Successfully",
                    "status": "success"}), 200


@app.route("/api/decision/get", methods=['GET'])
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


if __name__ == '__main__':
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
