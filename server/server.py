# Essential Imports for App Handling
from flask import Flask, request, jsonify, redirect, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import io
import os
import json
import uuid

# Gemini AI
from google import genai

# Database
from pymongo import MongoClient

# Registration / Login Libraries
import jwt
import bcrypt
from functools import wraps

# Utilities
from prompts import flashcard_prompt, mcq_prompt, short_response_prompt
import pdfplumber
import random
from bson.objectid import ObjectId
import smtplib
from datetime import datetime, timedelta
import time

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["https://study-ai-buddy.onrender.com"])

# Initialize MongoDB Client
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

# Authentication - For Protected Routes - Sources Referenced in Bib: "https://www.youtube.com/watch?v=_3NKBHYcpyg&t=896s, https://www.youtube.com/watch?v=8-W2O_R95Pk&t=2683s
def token_required(function):
    @wraps(function)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            response = make_response(redirect('login'))
            return response
        
        # Verify Token
        try:
            payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
        except:
            response = make_response(redirect('login'))
            response.delete_cookie('token')
            return jsonify({
                "message": "there was an invalid token",
                "token": token
            })
        request.username = payload['username']
        return function(*args, **kwargs)
    return decorated

@app.route("/")
def home():
    return "Welcome to the Flask API!"
## Registration / Login Routes
@app.route("/db/register_user", methods=["POST"])
def user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email").strip().lower()
    password = data.get("password").encode('utf-8')
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(password, salt)

    database = client.get_database("users-db")
    users = database.get_collection("users")

    query = { "email": email }
    user = users.find_one(query)
    if user:
        status = "An account with this email is already in use"
    else:
        query = { "username" : username}
        user = users.find_one(query)
        if user:
            status = "An account with this username is already in use"
        else:

            # Prompt Verfication
            data = request.get_json()
            email = data.get('email')

            if not email:
                return jsonify({"error": "You need to put in an email big bro"}), 400
            code = str(random.randint(100000, 999999))

            # syntax from AI
            try:
                with smtplib.SMTP("smtp.gmail.com", 587) as server:
                    server.starttls()
                    server.login(os.environ['EMAIL_USER'], os.environ['EMAIL_PASS'])
                    # Credit: ChatGPT for formatting the Email Message
                    message = (
                        f"From: {os.environ['EMAIL_USER']}\n"
                        f"To: {email}\n"
                        "Subject: Your Verification Code\n\n"
                        f"Your code is: {code}"
                    )
                server.sendmail(os.environ['EMAIL_USER'], email, message)

                # Store in the DB
                database["email-verification"].update_one(
                    {"email": email},
                    {"$set": {"code": code}},
                    upsert=True
                )
                status = "sent"
            except Exception as e:
                status = "error"

    return jsonify({
        "status": status,
        "user": username,
        "pw_hashed": pw_hash.decode('utf-8')
    })

@app.route('/verify-code',methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    username = data.get("username")
    pw = data.get('pw')
    code_entered = data.get('code')

    #if the user doesn't give in everything needed
    if not email or not code_entered:
        return jsonify({"error": "No email provided"}), 400
    
    # for now we are using the temporary variable i set up to look up the code
    # actual_code = verification_codes.get(email)
    database = client.get_database("users-db")
    users = database.get_collection("users")
    emails = database.get_collection("email-verification")
    user = emails.find_one({"email": email})
    #this is where we will compare it
    if user["code"] == code_entered:
        users.insert_one(
            {
                "username": username,
                "email": data.get('email'),
                "password": pw.encode('utf-8'),
                "saved_uploads": []
            }
        )
        return jsonify({"message": "this is the right code"}), 200
    else:
        return jsonify({"message": "this is the wrong code"}), 401

@app.route("/db/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    database = client.get_database("users-db")
    users = database.get_collection("users")

    query = { "username": username }
    
    user = users.find_one(query)
    if user and bcrypt.checkpw(password.encode("utf-8"), user.get("password")):
        # Generate Token
        token = jwt.encode({
            "exp": (datetime.now() + timedelta(minutes=10)).timestamp(),
            "username": username
        }, os.getenv("JWT_SECRET_KEY"), algorithm="HS256")
        response = make_response(jsonify({"token": token}))
        response.set_cookie(
            "token",
            token,
            httponly = True,
            max_age = 600,
            path='/',
            secure=True,
            samesite="None"
        )
        return response
    else:
        return {
            "status": "Wrong password"
        }

# Check whether cookie exists (Is User Still Logged in)
@app.route('/api/check-cookie')
def check_cookie():
    token = request.cookies.get('token')
    if token:
        return jsonify({"loggedIn": True, "token": token})
    else:
        return jsonify({"loggedIn": False})

# Clear Cookie for Logout
app.route('/api/clear-cookie')
def clear_cookie():
    response = make_response(jsonify({"status": "cleared cookie"}))
    response.delete_cookie(
        "token",
        path="/",
        secure=True,
        samesite="None"
    )
    return response

## Load Content Route
@app.route("/db/get_saved_uploads")
def get_saved_uploads():
    token = request.cookies.get('token')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    try: 
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
        username = payload.get("username")
        query = {"username": username}
        user = users.find_one(query)
        uploads = user.get("saved_uploads")
        return jsonify({"uploads": uploads})
    
    except:
        return jsonify({"error": "error authenticating for get_saved"})
    
## Flashcard Generation Routes
# Post a File Object - Returns array of flashcard objects {front: .., back: ..}
@app.route("/api/get_flashcard", methods=["POST"])
def get_flashcard():
    # File Processing in Memory
    file = request.files["file"]
    title = request.form["title"]
    subtitle = request.form['subtitle']
    comments = request.form['comments']

    content = file.read()
    text = ""

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    # Create Flashcards with Gemini API
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(flashcard_prompt + comments + ". The text is " + text)
    )
    data = response.text.strip('```json\n').strip('\n```')
    vocabs = json.loads(data)
    
    uploadObj = {
        "id": str(uuid.uuid4()),
        "type": "normal",
        "last_updated": time.time(),
        "title": title,
        "subtitle": subtitle,
        "content": vocabs
    }
    token = request.cookies.get('token')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    try: 
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
        username = payload.get("username")
        query = {"username": username}
        
        document = {'$push': {"saved_uploads": uploadObj}}

        users.update_one(query, document)
        return {
            "text": vocabs
        }
    except:
        return jsonify({"error": "error authenticating"})
    
# Post a File Object - Returns array of flashcard objects {question: .., options: .., answer}
@app.route("/api/get_questions", methods=["POST"])
def get_questions():
    # File Processing in Memory
    file = request.files["file"]
    title = request.form["title"]
    subtitle = request.form['subtitle']
    comments = request.form['comments']

    content = file.read()
    text = ""

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    # Create Flashcards with Gemini API
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(mcq_prompt + comments + ". Here are the notes: " + text  )
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    
    uploadObj = {
        "id": str(uuid.uuid4()),
        "last_updated": time.time(),
        "type": "question",
        "title": title,
        "subtitle": subtitle,
        "content": questions
    }
    token = request.cookies.get('token')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    try: 
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
        username = payload.get("username")
        query = {"username": username}
        
        document = {'$push': {"saved_uploads": uploadObj}}

        users.update_one(query, document)
        return {
            "text": questions
        }

    except:
        return jsonify({"error": "error authenticating"})

# Post a File Object - Returns array of flashcard objects {question: .., answer}
@app.route("/api/get_short_response", methods=["POST"])
def get_short_response():
    # File Processing in Memory
    file = request.files["file"]
    title = request.form["title"]
    subtitle = request.form['subtitle']
    comments = request.form['comments']
    content = file.read()
    text = ""

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    # Create Flashcards with Gemini API
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(short_response_prompt + comments + '. Text: ' + text)
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    
    uploadObj = {
        "id": str(uuid.uuid4()),
        "type": "shortResponse",
        "last_updated": time.time(),
        "title": title,
        "subtitle": subtitle,
        "content": questions
    }
    token = request.cookies.get('token')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    try: 
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
        username = payload.get("username")
        query = {"username": username}
        
        document = {'$push': {"saved_uploads": uploadObj}}

        users.update_one(query, document)
        return {
            "text": questions
        }

    except:
        return jsonify({"error": "error authenticating"})

# Short Response Feedback Checker
@app.route('/api/check', methods=["POST"])
def check_answer():
    question = request.json.get("question")
    answer = request.json.get("answer")
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=("First analyze whether the answer is valid based on the question. Write “YES” or “NO” followed by one newline. Then, provide short, concise suggestions or feedback. If possible, add other answers. Return in plain text, no new lines, no more than 400 characters, no special markdown characters like '**' other than basic punctuation. Question" + str(question) + ". Answer: " + str(answer) + ".")
    )
    feedback = response.text.split('\n')
    return jsonify({"isCorrect": feedback[0], "response": feedback[1]})

# Saves Content of Flashcards to User
@app.route('/api/save_card', methods=["POST"])
def save_card():
    id = request.json.get('id')
    type = request.json.get('type')
    title = request.json.get('title')
    subtitle = request.json.get('subtitle')
    new_content = request.json.get('new_content')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    token = request.cookies.get('token')

    
    payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
    username = payload.get("username")
    query = {"username": username}
    
    is_existing_card = users.find_one({
        "username": username, 
        "saved_uploads.id": id
    })
    if is_existing_card:
        # Use of Array Filters Syntax provided by ChatGPT
        update_operation = { "$set": 
            {
                "saved_uploads.$[card].last_updated": time.time(),
                "saved_uploads.$[card].title": title,
                "saved_uploads.$[card].subtitle": subtitle,
                "saved_uploads.$[card].content": new_content
            }
        }
        array_filters = [{"card.id": id}]
        result = users.update_one(query, update_operation, array_filters=array_filters)

        if result.modified_count == 0:
            return jsonify({"error": "No document was updated"}), 400
        return jsonify({"status": "saved"})
    else: 
        result = users.update_one(query, {
            "$push": {
                "saved_uploads" : {
                    "id": id,
                    "type": type,
                    "last_updated": time.time(),
                    "title": title,
                    "subtitle": subtitle,
                    "content": new_content
                }
            }
        })
        return jsonify({"status": "new card set and saved"})

# Update Time Stamp of Last Viewed
@app.route('/api/update-last-viewed', methods=["POST"])
def last_viewed():
    id = request.json.get('id')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    token = request.cookies.get('token')
    payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
    username = payload.get("username")
    query = {"username": username}
    # Use of Array Filters Syntax provided by ChatGPT
    array_filters = [{"card.id": id}]
    users.update_one(query, {
        "$set": {
            "saved_uploads.$[card].last_updated": time.time(),
        }
    }, array_filters=array_filters)
    return {"message": "updated"}

# Regenerate Flashcard based on Incorrect Answers
@app.route('/api/regenerate-flashcard', methods=["POST"])
def regenerate():
    id = request.json.get('id')
    database = client.get_database("users-db")
    users = database.get_collection("users")
    token = request.cookies.get('token')

    payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms="HS256")
    username = payload.get("username")
    query = {"username": username}
    if not token:
        return jsonify({"status": "not authenticated"})
    
    formattedInput = ''
    input = request.json.get("incorrect")
    type = request.json.get('type')
    for question in input:
        formattedInput += question + ", "
    instructions = f'The user has gotten these questions wrong, provide multiple questions that would give the user more practice based on these questions that were answered incorrectly: {formattedInput}, return only in the following format with no supplementary text: {"object with question, options, and answer where question and options correspond to an MCQ question" if type == "question" else "object with question and answer, where answer should be a short 1-2 sentence response"}'
    
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions)
    )

    data = response.text.strip('```json\n').strip('\n```')
    newQuestions = json.loads(data)
    array_filters = [{"card.id": id}]
    users.update_one(query, {
        "$set": {
            "saved_uploads.$[card].last_updated": time.time(),
            "saved_uploads.$[card].content": newQuestions
        }
    }, array_filters=array_filters)
    

    return jsonify({"new-questions": newQuestions})

# Ask-Studybuddy Helper Function
def get_reply(question, previousChatLog):
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    instructions = f"Without giving the user the direct answer of the question, '{question}',can you lead the user towards the right answer. Make sure user is on track. Return a short response no more than 20 words in plain text in a friendly manner? The previous chat history is this: '{previousChatLog}' and is asking '{previousChatLog[-1] if previousChatLog else 'no comment made yet'}'"

    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions)
    )
    return response.text

# ChatBot Endpoint to Assist User
@app.route('/ask-studybuddy', methods=['POST'])
def chatbot():
    data = request.json

    question = data.get('question')
    chatlog = data.get('chatlog')
    if not question:
        return jsonify({"response": "Pkease enter a question."}), 400
    
    answer = get_reply(question, chatlog) #this is where this route will look at the basic function for this whole feature to work
    return jsonify({"response": answer})
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
