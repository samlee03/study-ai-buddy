from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pdfminer.high_level import extract_text
from werkzeug.utils import secure_filename
import os
from google import genai
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/test/gemini")
def test_gemini():
    instructions = "Analyze the topic and ONLY return an array of questions with keys, question and options, revolving this topic. No other supplementary text needed"
    
    client = genai.Client(api_key=os.getenv("API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + "simplifying fractions")
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    return{
        "output": questions
    }

@app.route("/api/test")
def test():
    return {
        "questions": [
            {
                "question": "what is 1+1",
                "options": ["1", "2", "3"]
            },
            {
                "question": "what is 2+1",
                "options": ["1", "2", "3"]
            }
        ]
    }

# https://www.youtube.com/watch?v=pWd6Enu2Pjs -- source for fileuploading
@app.route("/api/readpdf", methods=["POST"])
def readpdf():
    file = request.files["file"] # OK
    filename = secure_filename(file.filename)
    filepath = os.path.join("uploads", filename)
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    file.save(filepath)
    text = (extract_text(filepath))
    os.remove(filepath)

    return {
        # "test": extract_text('./../tests/assets/pdfminer_test.pdf')
        # "text": extract_text(request.files["file"])
        "text": text
    }


if __name__ == '__main__':
    app.run(debug=True)