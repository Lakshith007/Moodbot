from flask import Flask, request, jsonify
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import torch

app = Flask(__name__)

tokenizer = BlenderbotTokenizer.from_pretrained("facebook/blenderbot-1B-distill")
model = BlenderbotForConditionalGeneration.from_pretrained("facebook/blenderbot-1B-distill")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('message', '')
    if not user_input:
        return jsonify({'response': "Please enter a message."})
    inputs = tokenizer(user_input, return_tensors="pt")
    reply_ids = model.generate(**inputs, max_length=100)
    response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)
    return jsonify({'response': response})

from flask import send_from_directory

# Serve the HTML and JS files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/chatbot.js')
def chatbot_js():
    return send_from_directory('.', 'chatbot.js')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
