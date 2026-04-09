from flask import Flask, render_template, request, jsonify
import requests
import os 

app = Flask(__name__)

# 👉 Replace with your actual OpenRouter / OpenAI API Key
API_KEY = "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"
@app.route('/')
def home():
    return render_template("index.html")

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json.get("question", "")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openrouter/free",
                "messages": [{"role": "user", "content": user_input}]
            }
        )

        # Check if the API request was successful
        if response.status_code == 200:
            data = response.json()
            answer = data["choices"][0]["message"]["content"]
            return jsonify({"answer": answer})
        else:
            return jsonify({"answer": f"API Error: {response.status_code} - {response.text}"})

    except Exception as e:
        return jsonify({"answer": "Error: " + str(e)})

if __name__ == "__main__":
    app.run(debug=True)