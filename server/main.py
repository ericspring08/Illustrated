from flask import Flask, jsonify, request
from flask_cors import CORS
import processword 

app = Flask(__name__)
CORS(app)

@app.route('/processword', methods=['POST'])
def ProcessWord():
    words = request.form['words']

    return jsonify(processword.ProcessWords(words).processwords())

if __name__ == '__main__':
    app.run(debug=True)
