from flask import Blueprint, request, jsonify
from services.ai_service import process_chat_message, generate_business_plan

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    history = data.get('history', [])
    user_context = data.get('user_context', {})

    if not message:
        return jsonify({'error': 'Message cannot be empty'}), 400

    response = process_chat_message(message, history, user_context)
    return jsonify(response), 200

@ai_bp.route('/business-plan', methods=['POST'])
def make_business_plan():
    data = request.get_json() or {}
    skill = data.get('skill_or_idea', '').strip()
    budget = data.get('investment_budget', '')
    location = data.get('location', '')

    if not skill:
        return jsonify({'error': 'Skill or business idea is required'}), 400

    plan = generate_business_plan(skill, budget, location)
    return jsonify({'business_plan': plan}), 200
