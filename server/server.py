from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Welcome to the Flask API!"

@app.route("/api/uploadType")
def uploadType():
    return {
        "UploadTypes" : [
            {
                "title" : "Vocabulary",
                "subtitle" : "Learn new words and improve your language skills."
            },
            {
                "title" : "Math",
                "subtitle" : "Practice math problems and improve calculations."
            },
            {
                "title" : "History",
                "subtitle" : "Some history subtitles"
            }
        ]
    }

@app.route("/api/tempUploads")
def tempUploads():
    return {
        "tempUploads": [
            {
                "title": "Question format",
                "subtitle": "Description",
                "type": "question"
            },
            {
                "title": "Normal format",
                "subtitle": "Description",
                "type": "normal"
            },
            {
                "title": "Question format",
                "subtitle": "Description",
                "type": "question"
            },
            {
                "title": "Normal format",
                "subtitle": "Description",
                "type": "normal"
            },
        ]
    }

@app.route("/api/questions")
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

@app.route("/api/flashcards")
def flashcard():
    return {
        "flashcards": [
            {
                "back": "A flat, elevated area of land that has been lifted up by natural forces. It is usually higher than the surrounding area and has steep sides.",
                "front": "Plateau"
            },
            {
                "back": "A piece of land that is surrounded by water on three sides but is still connected to the mainland.",
                "front": "Peninsula"
            }
        ]
    }

if __name__ == "__main__":
    app.run(debug=True)