from flask import Blueprint, request, jsonify

# Define Blueprint
main = Blueprint("main", __name__)

@main.route("/api/echo", methods=["POST"])
def echo():
    data = request.json  # Get JSON data from request
    if not data:
        return jsonify({"message": "No data provided"}), 400

    return jsonify({"received_data": data}), 200