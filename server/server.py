from flask import Flask, request, jsonify, redirect, make_response
from flask_cors import CORS
import io
import os
import json
import bcrypt
from pymongo import MongoClient
from bson.objectid import ObjectId
import uuid


from dotenv import load_dotenv
from datetime import datetime, timedelta
from functools import wraps
import jwt
import pdfplumber
from google import genai


app = Flask(__name__)
CORS(app, supports_credentials=True)

# MongoDB Client
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

# Authentication - For Protected Routes
def token_required(function):
    @wraps(function)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            print("THERE WAS NO TOKEN")
            response = make_response(redirect('login'))
            # return jsonify({
            #     "message": "there was no token"
            # })
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

@app.route("/api/uploadType")
def uploadType():
    return {
        "UploadTypes" : [
            {
                "title" : "Flashcards",
                "type" : "normal",
                "subtitle" : "Great for memorization and self-testing in subjects like vocabulary, definitions, and key concepts.",
            },
            {
                "title" : "Multiple Choice Questions",
                "type" : "question",
                "subtitle" : "A multiple-choice flashcard presents a question along with several answer options. Useful for quizzes, practice tests, and self-assessment in areas where recognition-based learning is effective."
            },
            {
                "title" : "Short Responses",
                "type" : "shortResponse",
                "subtitle" : "A short response flashcard requires the user to type out their answer in a text box before submitting it. This format is ideal for critical thinking, recall-based learning, and open-ended questions where written responses are necessary."
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

# Should take a File Object and return flashcards, will be a POST request, Returns flashcards & Stores in db
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
            "exp": (datetime.now() + timedelta(minutes=10)).timestamp(),
            "username": username
        }, os.getenv("JWT_SECRET_KEY"), algorithm="HS256")
        # response = make_response(redirect('http://localhost:5173/main'))
        response = make_response(jsonify({"token": token}))
        response.set_cookie(
            "token",
            token,
            httponly = True,
            max_age = 600,
            path='/'
        )
        return response
    else:
        return {
            "status": "Wrong password"
        }

@app.route("/db/get_uploads")
def get_uploads():
    database = client.get_database("users-db")
    users = database.get_collection("users")
    # query = {"username": "dummy"}
    # get username from payload
    query = {"username": request.username}

    user = users.find_one(query)
    uploads = user.get("saved_uploads")
    if uploads:
        # print("uploads: " + uploads)
        return jsonify({
            "uploads": uploads
        })
    else:
        print("no uploads")
        return jsonify({
            "message": "No uploads!"
        })

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
        # print(uploads)
        return jsonify({"uploads": uploads})
    
    except:
        return jsonify({"error": "error authenticating for get_saved"})
    

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
    instructions = "Return ONLY an array of pairs, with keys 'front' and 'back' of the vocabulary I list. No supplementary text needed. If the text provided isn't a traditional, front and back, try your best to synthesize information in a front and back order. Also keep in mind of the user comments: "
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + comments + ". The text is " + text)
    )
    data = response.text.strip('```json\n').strip('\n```')
    vocabs = json.loads(data)
    
    uploadObj = {
        "id": str(uuid.uuid4()),
        "type": "normal",
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
    instructions = "Analyze the topic and ONLY return an array of questions with keys, question options and answer (one of the options), revolving this topic. No other supplementary text needed. Format I want it in {question: .., options: .., answer} These are some user comments you may want to consider when creating the question set. "
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + comments + ". Here are the notes: " + text  )
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    
    uploadObj = {
        "id": str(uuid.uuid4()),
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

# Post a File Object - Returns array of flashcard objects {question: .., options: .., answer}
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
    instructions = "Analyze the topic and ONLY return an array of questions in dictionary format with the question revolving this topic. It should test for the following material and can be answered in a sentence or two. Question should be easy to comprehend. No other supplementary text needed. Here are some comments from the user"
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions + comments + '. Text: ' + text)
    )
    data = response.text.strip('```json\n').strip('\n```')
    questions = json.loads(data)
    
    uploadObj = {
        "id": str(uuid.uuid4()),
        "type": "shortResponse",
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

# @app.route('/api/cookie')
# def cookie():
#         response = make_response(jsonify({"message": "Cookie Set"}))
#         response.set_cookie(
#             "token",
#             "textover here...",
#             httponly = True,
#             max_age = 59,
#             path='/'
#         )
#         return response

@app.route('/api/check', methods=["POST"])
def check_answer():
    question = request.json.get("question")
    answer = request.json.get("answer")
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    # print("this ran")
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=("First analyze whether the answer is valid based on the question. Write “YES” or “NO” followed by one newline. Then, provide short, concise suggestions or feedback. If possible, add other answers. Return in plain text, no new lines, no more than 400 characters, no special markdown characters like '**' other than basic punctuation. Question" + str(question) + ". Answer: " + str(answer) + ".")
    )
    feedback = response.text.split('\n')
    # return jsonify({"response": response.text})
    return jsonify({"isCorrect": feedback[0], "response": feedback[1]})

    
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

        update_operation = { "$set": 
            {
                "saved_uploads.$[card].title": title,
                "saved_uploads.$[card].subtitle": subtitle,
                "saved_uploads.$[card].content": new_content
            }
        }
        array_filters = [{"card.id": id}]
        print("Card ID:", id)


        result = users.update_one(query, update_operation, array_filters=array_filters)
        print("Username from token:", username)

        if result.modified_count == 0:
            return jsonify({"error": "No document was updated"}), 400
        print("saved")
        return jsonify({"status": "saved"})
    else: 
        print("New Card")
        result = users.update_one(query, {
            "$push": {
                "saved_uploads" : {
                    "id": id,
                    "type": type,
                    "title": title,
                    "subtitle": subtitle,
                    "content": new_content
                }
            }
        })


        return jsonify({"status": "new card set and saved"})

@app.route('/api/clear-cookie')
def clear_cookie():
    response = make_response(jsonify({"status": "cleared cookie"}))
    response.delete_cookie('token')
    return response


@app.route('/api/textbot')
def textbot():
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=("Before generating questions, can you ask me questions to clarify on what I'm weak on based on the topic? to generate for me")
    )

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
    instructions = f"The user has gotten these questions wrong, provide multiple questions that would give the user more practice based on these questions that were answered incorrectly: {formattedInput}, return only in the following format with no supplementary text: {'object with question, options, and answer where question and options correspond to an MCQ question' if type == "question" else 'object with question and answer, where answer should be a short 1-2 sentence response'}"
    
    genclient = genai.Client(api_key=os.getenv("API_KEY"))
    response = genclient.models.generate_content(
        model="gemini-2.0-flash", contents=(instructions)
    )

    data = response.text.strip('```json\n').strip('\n```')
    newQuestions = json.loads(data)
    array_filters = [{"card.id": id}]
    users.update_one(query, {
        "$set": {
            "saved_uploads.$[card].content": newQuestions
        }
    }, array_filters=array_filters)
    

    return jsonify({"new-questions": newQuestions})

# @app.route('/api/create-first-upload', methods=["POST"])
# def create_first_upload():
#     id = request.json.get('id')
    

@app.route('/api/check-cookie')
def check_cookie():
    token = request.cookies.get('token')
    if token:
        return jsonify({"loggedIn": True, "token": token})
    else:
        return jsonify({"loggedIn": False})
if __name__ == "__main__":
    app.run(debug=True)