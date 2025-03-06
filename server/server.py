from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/test")
def test():
    return {
        "questions": [
            {
                "question": "What is 1+1?",
                "options": ["1", "2", "3"],
                "answer" : "2"
            },
            {
                "question": "What is 2+1?",
                "options": ["1", "2", "3"],
                "answer" : "3"
                
            },
            {
                "question": "What is 2+2?",
                "options": ["1", "2", "4"],
                "answer" : "4"
            },
            {
                "question": "What is 2+1?",
                "options": ["1", "2", "3"],
                "answer" : "3"
            }
        ]
    }

if __name__ == "__main__":
    app.run(debug=True)