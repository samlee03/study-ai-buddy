from flask import Flask, jsonify, request
from flask_cors import CORS
import io
import os
import json
import bcrypt
from pymongo import MongoClient
from dotenv import load_dotenv


app = Flask(__name__)
CORS(app)

# MongoDB Client
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

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


@app.route("/db/register_user", methods=["POST"])
def user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password").encode('utf-8')
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(password, salt)


    database = client.get_database("users-db")
    users = database.get_collection("users")

    # email = "test@email.com"
    query = { "email": email }
    user = users.find_one(query)
    print(email)
    if user:
        status = "An account with this email is already in use"
    else:
        query = { "username" : username}
        user = users.find_one(query)
        if user:
            status = "An account with this username is already in use"
        else:
            print("created user")
            users.insert_one(
                {
                    "username": data.get('username'),
                    "email": data.get('email'),
                    "password": pw_hash,
                    "saved_uploads": []
                }
            )
            status = "Created user"

    return jsonify({
        "status": status
    })

@app.route("/db/login")
def login():
    
    database = client.get_database("users-db")
    users = database.get_collection("users")
    username = "dummy1"
    password = "test123"
    query = { "username": username }
    # Check for pw
    
    user = users.find_one(query)
    if user and bcrypt.checkpw(password.encode("utf-8"), user.get("password")):
        return {
            "status": "Logged in"
        } 
    else:
        return {
            "status": "Wrong password"
        }


if __name__ == "__main__":
    app.run(debug=True)