from flask import Blueprint, request, jsonify
from pypdf import PdfReader


# Define Blueprint
main = Blueprint("main", __name__)

@main.route("/api/echo", methods=["POST"])
def echo():
    data = request.json  # Get JSON data from request
    if not data:
        return jsonify({"message": "No data provided"}), 400

    return jsonify({"received_data": data}), 200


@main.route("/api/test")
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

# @main.route("/readpdf")
# def readPdf():
#     reader = PdfReader("../../tests/assets/test.pdf")
#     page = reader.pages[0]
#     return {
#         "text": page.extract_text()
#         # "text": "test"
#     }