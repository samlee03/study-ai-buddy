from flask import Flask, request, jsonify, redirect, make_response
from flask_cors import CORS, cross_origin
from pdfminer.high_level import extract_text
from werkzeug.utils import secure_filename
import os
from google import genai
from dotenv import load_dotenv
import json
from pymongo import MongoClient
import pdfplumber
import io
import bcrypt

from datetime import datetime, timedelta
from functools import wraps
import jwt

#i am adding this for the email verfication
import random
import smtplib

load_dotenv()

app = Flask(__name__)

CORS(app)


uri = os.getenv("MONGO_URI")
client = MongoClient(uri)


def token_required(function):
    @wraps(function)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            print("THERE WAS NO TOKEN")
            return jsonify({
                "message": "there was no token"
            })
        
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



# Routes
@app.route("/test/gemini")
def test_gemini():
    instructions = "Analyze the topic and ONLY return an array of questions with keys, question and options, revolving this topic. No other supplementary text needed."
    
    client = genai.Client(api_key=os.getenv("API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + "simplifying fractions")
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    return{
        "questions": questions
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

@app.route("/api/flashcard")
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

# # 
# Post a File Object - Returns array of flashcard objects {front: .., back: ..}
@app.route("/api/get_flashcard", methods=["POST"])
def get_flashcard():
    # File Processing in Memory
    file = request.files["file"]
    content = file.read()
    text = ""

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    # Create Flashcards with Gemini API
    instructions = "Return ONLY an array of pairs, with keys 'front' and 'back' of the vocabulary I list next. No supplementary text needed. The text is: "
    client = genai.Client(api_key=os.getenv("API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + text)
    )
    data = response.text.strip('```json\n').strip('\n```')
    vocabs = json.loads(data)
    
    return {
        "text": vocabs
    }
# Post a File Object - Returns array of flashcard objects {question: .., options: .., answer}
@app.route("/api/get_questions", methods=["POST"])
def get_questions():
    # File Processing in Memory
    file = request.files["file"]
    content = file.read()
    text = ""

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    # Create Flashcards with Gemini API
    instructions = "Analyze the topic and ONLY return an array of questions with keys, question and options, revolving this topic. No other supplementary text needed."
    client = genai.Client(api_key=os.getenv("API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + text)
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    
    return {
        "text": questions
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

@app.route("/db/login", methods=["POST"])
def login():
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    database = client.get_database("users-db")
    users = database.get_collection("users")

    # username = "dummy1"
    # password = "test123"
    query = { "username": username }
    # Check for pw
    
    user = users.find_one(query)
    if user and bcrypt.checkpw(password.encode("utf-8"), user.get("password")):
        # Generate Token
        token = jwt.encode({
            "exp": (datetime.now() + timedelta(seconds=20)).timestamp(),
            "username": username
        }, os.getenv("JWT_SECRET_KEY"), algorithm="HS256")
        # response = make_response(redirect('http://localhost:5173/main'))
        response = make_response(jsonify({"token": token}))
        response.set_cookie(
            "token",
            token,
            httponly = True,
            max_age = 30
        )
        return response
    else:
        return {
            "status": "Wrong password"
        }


# Grabs Upload from MongoDB
@app.route("/db/get_uploads")
@token_required
def get_uploads():
    database = client.get_database("users-db")
    users = database.get_collection("users")
    # query = {"username": "dummy"}
    # get username from payload
    query = {"username": request.username}

    user = users.find_one(query)
    uploads = user.get("saved_uploads")
    if uploads:
        return jsonify({
            "uploads": uploads
        })
    else:
        return jsonify({
            "message": "No uploads!"
        })

@app.route('/api/cookie')
def cookie():
        response = make_response(jsonify({"message": "Cookie Set"}))
        response.set_cookie(
            "token",
            "textover here...",
            httponly = True,
            max_age = 15,
            path='/'
        )
        return response



####this is work in progress for email authentication####


#so this route will send the code to the user's email
verification_codes = {}  #this is just a temporary placeholder instead of the database

@app.route('/send-code',methods=['POST'])
def send_code():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "You need to put in an email big bro"}), 400
    
    #I learned this syntax from online but it should make up a random code
    code = str(random.randint(100000, 999999))
    verification_codes[email] = code

    # we are going to attempt to send the code to the email
    # I should mention, i got syntax help from AI
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.environ['EMAIL_USER'], os.environ['EMAIL_PASS'])
            # Credit: ChatGPT for formatting the Email Message
            message = f"""From: {os.environ['EMAIL_USER']}
To: {email}
Subject: Your Verification Code

Your code is: {code}
"""
            server.sendmail(os.environ['EMAIL_USER'], email, message)
        return jsonify({"message": "Here is your code"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
##so this route will get the code from the user and make sure it's correct before the user can proceed.

@app.route('/verify-code',methods=['POST'])
def verifiy_code():
    data = request.get_jason()
    email = data.get('email')
    code_entered = data.get('code')

    #if the user doesn't give in everything needed
    if not email or not code_entered:
        return jsonify({"error": "where ya code and email at lil bro"}), 400
    
    # for now we are using the temporary variable i set up to look up the code
    actual_code = verification_codes.get(email)

    #this is where we will compare it
    if actual_code == code_entered:
        return jsonify({"message": "this is the right code"}), 200
    else:
        return jsonify({"message": "this is the wrong code"}), 401
    
# note #1: to teammates (especially Sam), i am not sure if you guys already know this but i am using http status codes i found through google to label the outcomes for the routes above.
# note #2: I didn't use mongodb yet, just a temp dict, for the routes above, I want to test out the routes with you before i do that.


if __name__ == '__main__':
    app.run(debug=True)

#chatbot feature, work in progress

#so first i am going to build an basic function that will utilize gemini to get an response to an question
#got syntax help from ai since i am still fairly new when it comes to building ai features, but i am learning as i build this app
def get_reply(question):
    genai.configure(api_key=os.getenv("Gemini key (my bad guys accidentally pushed it into repo last time)"))
    model = genai.GenerativeModel('gemini-pro') #after doing some research, gemini pro is perfect for text generation when coming up with study material
    reply = model.generate_content(question)
    return reply.text

#and now I am going to build the route that will utilize the basic function (get_reply)

@app.route('/ask-studybuddy', methods=['POST'])
def chatbot():
    data = request.json
    question = data.get('question', '')
    if not question:
        return jsonify({"response": "Pkease enter a question."}), 400
    
    answer = get_reply(question) #this is where this route will look at the basic function for this whole feature to work
    return jsonify({"response": answer})

#note to teammate Sam, please reach out to me for any questions