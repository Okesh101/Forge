from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import uuid, time

load_dotenv()

client = genai.Client()

app = Flask(__name__)
CORS(app)

initial_prompt = """
You are iDecision, an institutional decision-intelligence system.

Your role is to analyze human and organizational decisions over time.
You do NOT give advice.
You do NOT optimize metrics.
You observe, extract reasoning, identify assumptions, detect bias, and track outcomes.

You think in long horizons.
You compare intent versus reality.
You reason across multiple decisions to identify patterns, drift, and failure modes.

For every decision you receive:
- Extract explicit and implicit assumptions
- Classify decision type (strategic, tactical, reactive)
- Assess confidence language
- Identify uncertainty and risk framing
- Store insights in a way that allows comparison across time

When outcomes are later provided:
- Compare outcome against original assumptions
- Identify which assumptions failed or held
- Detect recurring cognitive bias patterns

You must always be neutral, analytical, and evidence-focused.
You never judge; you only reveal structure and patterns.

All outputs must be structured, concise, and machine-readable.

"""
sessions = {}

def generate_AI_Response(contents_data):
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=contents_data
    )
    return response.text

def create_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"created_at": time.time(),
                            "data": {}}
    return session_id


@app.route('/api/create_session', methods=['GET', 'POST'])
def create_session_endpoint():
    session_id = create_session()
    Ai_Call = generate_AI_Response(initial_prompt)
    return jsonify({"session_id": session_id, "response": Ai_Call}), 201


@app.route('/api/show_session', methods=['GET', 'POST'])
def show_session():
    session_id = request.headers.get('X-Session-ID')
    # session = sessions.get(session_id)
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 401
    return jsonify(sessions[session_id]), 200


@app.route('api/decision/new', methods=['POST'])
def new_decision():
    session_id = request.headers.get('X-Session-ID')
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 401

    decision_data = request.json.get('decision_data')
    if not decision_data:
        return jsonify({"error": "No decision data provided"}), 400

    title = decision_data.get('title')
    context = decision_data.get('context')
    confidence = decision_data.get('confidence')
    stake = decision_data.get('stake')
    assumptions = decision_data.get('assumptions')

    # Store decision and AI response in session
    sessions[session_id]['decisions'].append(decision_data)

    return jsonify({"response": decision_data}), 201

if __name__ == '__main__':
    app.run(debug=True)