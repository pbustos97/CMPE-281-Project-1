import boto3
from flask import Flask, request, json, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/users', methods=['GET'])
def userGetAll():
    return jsonify({'users': []})

@app.route('/user/register', methods=['POST'])
def userRegister():
    reqDict = request.get_json()
    email = reqDict['email']
    fname = reqDict['first_name']
    lname = reqDict['last_name']
    hashedPassword = reqDict['password']
    regDate = reqDict['date']
    
    # Should redirect to login page instead
    return jsonify({'token': 'abcd', 'refresh_token': 'xyz'})

@app.route('/user/login', methods=['POST'])
def userLogin():
    reqDict = request.get_json()
    email = reqDict['email']
    hashedPassword = reqDict['password']
    
    # Should return jwt tokens instead
    return jsonify({'token': 'fjkenv', 'refresh_token': 'jdfklajf'})

@app.route('/user/<id>', methods=['GET'])
def userGet(id):
    user = f'user object {id} from db'
    return jsonify(user)

@app.route('/user/<id>', methods=['PUT'])
def userUpdate(id):
    return 200, 'Successful user edit'

@app.route('/user/<id>', methods=['DELETE'])
def userDelete(id):
    return 200, 'Successful user delete'

@app.route('/files', methods=['GET'])
def fileGetAll():
    return jsonify({'files': [{'file': 'yes'}, {'file': 'no'}]})

@app.route('/files', methods=['POST'])
def fileUpload():
    return 200, 'Successful file upload'

@app.route('/file/<id>', methods=['PUT'])
def fileUpdate(id):
    return 200, 'Successful file update'

@app.route('/file/<id>', methods=['DELETE'])
def fileDelete(id):
    return 200, 'Successful file delete'

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
