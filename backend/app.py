import boto3
import os
from botocore.exceptions import ClientError
from flask import Flask, request, json, jsonify, make_response, session
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from flask_cors import CORS, cross_origin
from functools import wraps
from datetime import datetime, timedelta

"""
Create endpoint to send email back to client if requested.
Just decode the JWT and return email
"""


app = Flask(__name__)
JWTManager(app)
CORS(app)

# JWT Configurations
app.config['SECRET_KEY'] = 'changelater'
app.config['JWT_COOKIE_SECURE'] = False

# AWS Configurations
awsSession = boto3.session.Session(profile_name='rootAdmin')
app.config['BUCKET_NAME'] = 'cmpe281-p1-files'

# Should return list of all users, admin only
@app.route('/users', methods=['GET'])
def userGetAll():
    return jsonify({'users': []})

# Registration endpoint
@app.route('/user/register', methods=['POST'])
def userRegister():
    reqDict = request.get_json()
    email = reqDict['email']
    fname = reqDict['first_name']
    lname = reqDict['last_name']
    hashedPassword = reqDict['password']
    regDate = round(int(reqDict['date'])/1000)
    userTable = dynamoDbGetTable('users')
    
    # Check if email is in user table
    response = userTable.get_item(Key={'email': email})

    if ('Item' in response):
        return jsonify({'message': 'failed registration', 'success': 'false'})
    else:
        userTable.put_item(
            Item={
                'email': email,
                'password': hashedPassword,
                'first_name': fname,
                'last_name': lname,
                'date': regDate,
            }
        )
        response = jsonify({'message': 'successful registration', 'success': 'true'})
    
    # Should redirect to login page instead
    return response

# Login endpoint
@app.route('/user/login', methods=['POST'])
def userLogin():
    reqDict = request.get_json()
    email = reqDict['email']
    hashedPassword = reqDict['password']
    response = ''

    # If password hash is in database return new jwt
    userTable = dynamoDbGetTable('users')
    res = userTable.get_item(Key={'email': email})
    item = res['Item']

    if (email == item['email'] and hashedPassword == item['password']):


        # Don't include in token, call /user/<id> endpoint to get name
        fname = item['first_name']
        lname = item['last_name']


        token = create_access_token(identity={
            'email': email, 
            'first_name': fname, 
            'last_name': lname,
            })
        response = jsonify({'message': 'Successful login', 'success': 'true', 'token': token})
    else:
        response = jsonify({'message': 'Unable to verify login', 'success': 'false'})

    return response

# Should return user data from DynamoDB
@app.route('/user/<id>', methods=['GET'])
def userGet(id):
    user = f'user object {id} from db'
    return jsonify(user)

# Modify user profile data
@app.route('/user/<id>', methods=['PUT'])
def userUpdate(id):
    return 200, 'Successful user edit'

# Delete user profile, should only be called by admin accounts
@app.route('/user/<id>', methods=['DELETE'])
def userDelete(id):
    return 200, 'Successful user delete'

# Returns list of files the user has access to. If admin, different function
@app.route('/files', methods=['GET'])
def fileGetAll():
    s3 = awsSession.resource('s3')
    return jsonify({'files': [{'file': 'yes'}, {'file': 'no'}]})

# Upload files, file replacement is handled by AWS
# Updates need to change modified date only
@app.route('/files', methods=['POST'])
def fileUpload():
    # Handle js FormData token first
    token = request.form['token']
    token = jwt.decode(token, app.config['SECRET_KEY'])
    print(token)

    file = request.files['file']
    fileName = request.form['file_name']
    fileDescription = request.form['file_description']
    email = request.form['email']
    dates = (int(request.form['upload_date']), int(request.form['update_date']))

    filePath = email + '/' + fileName
    print(os.path)
    print(filePath)
    file.save(fileName)
    size = os.path.getsize(fileName)

    # Try to check if object is in bucket
    # If not in bucket, continue with function
    # Else, update file instead

    # Get Object from S3 Bucket
    s3File = s3GetObject(filePath)
    
    # Upload to S3 and remove from local system
    try:
        s3File.put(Body=open(fileName, 'rb'), ACL='public-read')
        os.remove(fileName)
        
        if getFileInDB():
            modifyDBEntry(filePath, email, fileDescription, dates, size)
        else:
            insertFileToDB(filePath, email, fileDescription, dates, size)
    except Exception as e:
        print(e)

    return jsonify({'message': 'Successful upload', 'success': 'true'})

# DynamoDB specific functions
def getFileInDB():
    return False

def modifyDBEntry(fileName, email, description, dates, size):
    modifiedDate = datetime.fromtimestamp(round(dates[1] / 1000))
    print(modifiedDate)
    return

def insertFileToDB(fileName, email, description, dates, size):
    uploadDate = datetime.fromtimestamp(round(dates[0] / 1000))
    modifiedDate = datetime.fromtimestamp(round(dates[1] / 1000))
    print(modifiedDate)
    return

# Figure out how to get URL from boto3
@app.route('/file/<id>', methods=['GET'])
def fileGet(id):
    s3File = s3GetObject(id)
    return 200, 'Successful file get'

# Might delete
@app.route('/file/<id>', methods=['PUT'])
def fileUpdate(id):
    s3File = s3GetObject(id)
    return 200, 'Successful file update'

# Will always return a successful delete because of how boto3 S3.Objects are coded
@app.route('/file/<id>', methods=['DELETE'])
def fileDelete(id):
    s3File = s3GetObject(id)

    # Should not produce an error but it's there just in case
    try:
        s3Del = s3File.delete()

        #delete entry from database
    except Exception as e:
        print(e)

    return jsonify({'message': 'Successful delete', 'success': 'true'})

# Common AWS commands
def s3GetObject(object:str):
    s3 = awsSession.resource('s3')
    return s3.Object(app.config['BUCKET_NAME'], object)

def dynamoDbGetTable(table:str):
    dynamoDb = awsSession.resource('dynamodb', region_name='us-west-2', endpoint_url='http://localhost:8000')
    return dynamoDb.Table(table)


# Might need later    
def tokenCheck(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token missing', 'success': 'false'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Invalid Token', 'success': 'false'}), 403
        return func(*args, **kwargs)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
