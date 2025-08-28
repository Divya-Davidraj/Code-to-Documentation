from flask import Flask, request, send_file, render_template_string
from flask_cors import CORS
import requests, json, tempfile, os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_URL = "https://aoai-farm.bosch-temp.com/api/openai/deployments/askbosch-prod-farm-openai-gpt-4o-mini-2024-07-18/chat/completions?api-version=2024-08-01-preview"
API_KEY = os.getenv("API_KEY", "8a1694dc19d74d5cabe07597eac11235")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ✅ Home page with simple upload form
@app.route("/", methods=["GET"])
def home():
    return render_template_string("""
    <h2 style="text-align:center;">🚀 Code to Documentation </h2>
    <p style="text-align:center;">Please upload a code snippet file to convert into a documentation</p>
    <form method="post" action="/generate" enctype="multipart/form-data" style="text-align:center; margin-top:20px;">
        <input type="file" name="file" required>
        <button type="submit">Generate</button>
    </form>
    """)

# ✅ Main API to generate documentation
@app.route("/generate", methods=["POST"])
def generate_documentation():
    file = request.files.get("file")
    if not file:
        return {"error": "No file uploaded"}, 400

    doc_type = request.form.get("doc_type", "txt")
    code_content = file.read().decode("utf-8")

    # GPT API request
    headers = {
        "Content-Type": "application/json",
        "genaiplatform-farm-subscription-key": API_KEY
    }
    data = {
        "model": "gpt-4o-mini",
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": "You are an expert in analysing code. Provide detailed documentation."},
            {"role": "user", "content": f"Generate documentation for this code in {doc_type} format:\n\n{code_content}"}
        ]
    }

    response = requests.post(API_URL, headers=headers, data=json.dumps(data))

    if response.status_code != 200:
        return {"error": response.text}, 500

    content = response.json()["choices"][0]["message"]["content"]

    # Save to temporary file
    ext = "md" if doc_type == "markdown" else doc_type
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}")
    with open(tmp.name, "w", encoding="utf-8") as f:
        f.write(content)

    return send_file(tmp.name, as_attachment=True, download_name=f"documentation.{ext}")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
