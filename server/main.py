from flask import Flask, jsonify, request
from flask_cors import CORS
import processword 
import nltk

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET"])
def index():
    return jsonify({"message": "Hello World"})

@app.route('/processword', methods=['POST'])
def ProcessWord():
    nltk.download('punkt')
    nltk.download('stopwords')
    words = request.form['words']

    return jsonify(processword.ProcessWords(words).processwords())

if __name__ == '__main__':
    app.run()
