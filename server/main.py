from flask import Flask, jsonify, request
from flask_cors import CORS
import processword 
import nltk
import base64

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET"])
def index():
    return jsonify({"message": "Hello World"})

@app.route('/processword', methods=['POST'])
def ProcessWord():
    nltk.download('punkt')
    nltk.download('stopwords')
    words = request.json['words']

    return jsonify(processword.ProcessWords(words).processwords())

@app.route("/converter", methods=["POST"])
def Converter():
    pdf = request.form["pdf"]
    encoded = pdf.encode("ascii")
    decoded = base64.b64decode(encoded)
    text = decoded.decode("ascii")

    return jsonify({text: text})


if __name__ == '__main__':
    app.run(debug=True)
