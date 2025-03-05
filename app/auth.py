from flask import Blueprint, request, jsonify  # Import Flask utilities
from app import db  # Import database instance
from app.models import User  # Import User model

# Create Blueprint for authentication routes
auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    """
    Handles user registration.
    - Receives JSON: { "email": "test@example.com", "password": "secure123" }
    - Hashes password and stores the user in the database.
    - Returns success message or error if the user already exists.
    """
    data = request.json  # Get JSON data from request
    email = data.get("email")  # Extract email from request
    password = data.get("password")  # Extract password

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400  # Return error if missing fields

    # Check if user already exists in the database
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Create new user and hash the password
    new_user = User(email=email)
    new_user.set_password(password)  # Hashes and stores password

    db.session.add(new_user)  # Add user to the database
    db.session.commit()  # Save changes

    return jsonify({"message": "User registered successfully"}), 201  # Return success response
