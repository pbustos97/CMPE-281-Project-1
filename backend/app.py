import mysql.connector
import boto3
import os
import jwt
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

db = mysql.connector.connect(host='localhost', user='root',passwd='password', database='cmpe281files')

cur = db.cursor()

# JWT Configurations
app.config['SECRET_KEY'] = 'changelater'
app.config['JWT_COOKIE_SECURE'] = False

# AWS Configurations
awsSession = boto3.session.Session(profile_name='rootAdmin')
app.config['BUCKET_NAME'] = 'cmpe281-p1-files'

## User endpoints

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
    role = 'user'
    userTable = dynamoDbGetTable('users')
    
    # Check if email is in user table
    response = userTable.get_item(Key={'email': email})

    if ('Item' in response):
        return jsonify({'message': 'failed registration', 'success': 'false'})
    else:
        userTable.put_item(
            Item={
                'email': email,
                'passwordHash': hashedPassword,
                'first_name': fname,
                'last_name': lname,
                'date': regDate,
                'role': role
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
    response = None

    # If password hash is in database return new jwt
    userTable = dynamoDbGetTable('users')
    res = userTable.get_item(Key={'email': email})
    item = res['Item']

    token = None
    if (email == item['email'] and hashedPassword == item['passwordHash']):

        token = create_access_token(identity={
            'email': email
            })
        response = jsonify({'message': 'Successful login', 'success': 'true', 'token': token})
    else:
        response = jsonify({'message': 'Unable to verify login', 'success': 'false'})
   
    return make_response(response)

# Should return user data from DynamoDB
@app.route('/user', methods=['GET'])
def userGet():
    id = request.form['email']
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

## File endpoints

# Returns list of files the user has access to. If admin, different function
@app.route('/files', methods=['GET'])
def fileGetAll():
    if (tokenValid(request.headers['Authorization']) == False):
        return jsonify({'message': 'Expired or invalid token', 'success': 'false'})
    token = jwt.decode(request.headers['Authorization'], app.config['SECRET_KEY'],algorithms=['HS256'])
    s3 = awsSession.resource('s3')
    userTable = dynamoDbGetTable('users')
    res = userTable.get_item(Key={'email': token['sub']['email']})
    item = res['Item']
    files = []
    response = ''


    # return all files in the db
    # else return files with linked email
    if (item['role'] == 'admin' and request.args.get('email') == None): 
        cur.execute('SELECT * FROM files')
        files = cur.fetchall()
        #print(files)
    else:
        cur.execute('SELECT * FROM files WHERE email=\'%s\'' % item['email'])
        files = cur.fetchall()
        #print(files)
    return jsonify(files)

# Upload files, file replacement is handled by AWS
# Updates need to change modified date only
@app.route('/files', methods=['POST'])
def fileUpload():
    # Handle access token first
    token = request.headers['authorization']
    if (tokenValid(token) == False):
        return jsonify({'message': 'Expired or invalid token', 'success': 'false'})
    token = jwt.decode(token, app.config['SECRET_KEY'],algorithms=['HS256'])

    file = request.files['file']
    fileName = request.form['file_name']
    fileDescription = request.form['file_description']
    email = request.form['email']
    dates = (round(int(request.form['upload_date'])/1000), round(int(request.form['update_date'])/1000))


    filePath = email + '/' + fileName
    file.save(fileName)

    # Try to check if object is in bucket
    # If not in bucket, continue with function
    # Else, update file instead

    # Get Object from S3 Bucket
    s3File = s3GetObject(filePath)
    
    # Upload to S3 and remove from local system
    try:
        s3File.put(Body=open(fileName, 'rb'), ACL='public-read')
        os.remove(fileName)
        s3 = boto3.client('s3')
        url = '{}/{}/{}'.format(s3.meta.endpoint_url, app.config['BUCKET_NAME'], filePath)
        print(url)

        if getFileInDB(filePath):
            modifyDBEntry(filePath, email, fileDescription, dates)
        else:
            insertFileToDB(filePath, fileName, email, fileDescription, dates, url)
    except Exception as e:
        print(e)

    return jsonify({'message': 'Successful upload', 'success': 'true'})

# RDS specific functions. filePath includes the fileName
def getFileInDB(filePath: str):
    # Fix return value later
    cur.execute('SELECT * FROM files WHERE file_path = \'%s\'' % (filePath))
    files = cur.fetchall()
    if len(files) == 0:
        return False
    return True

def modifyDBEntry(filePath, email, description, dates):
    modifiedDate = datetime.fromtimestamp(dates[1]).strftime('%c')
    try:
        cur.execute('UPDATE files SET modify_date = \'%s\', description = \'%s\' WHERE file_path = \'%s\'' % (modifiedDate, description, filePath))
    except Exception as e:
        print(e)
        return
    db.commit()
    return

def insertFileToDB(filePath, fileName, email, description, dates, url):
    uploadDate = datetime.fromtimestamp(dates[0]).strftime('%c')
    modifiedDate = datetime.fromtimestamp(dates[1]).strftime('%c')
    try:
        cur.execute('INSERT INTO files VALUES (\'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\')' % (filePath, fileName, email, description, uploadDate, modifiedDate, url))
    except Exception as e:
        print(e)
        return
    db.commit()
    return

# Figure out how to get URL from boto3
@app.route('/file', methods=['GET'])
def fileGet():
    s3File = s3GetObject(id)
    return 200, 'Successful file get'

# Will always return a successful delete because of how boto3 S3.Objects are coded
@app.route('/file', methods=['POST'])
def fileDelete():
    token = request.headers['authorization']
    if (tokenValid(token) == False):
        return jsonify({'message': 'Expired or invalid token', 'success': 'false'})
    token = jwt.decode(token, app.config['SECRET_KEY'],algorithms=['HS256'])

    s3File = s3GetObject(request.form['file'])

    # Check executing user's role
    userTable = dynamoDbGetTable('users')
    res = userTable.get_item(Key={'email': token['sub']['email']})
    item = res['Item']
    print(item)
    if (item['role'] != 'admin' or item['email'] != token['sub']['email']):
        return jsonify({'message': 'Unauthorized delete', 'success': 'false'})
    

    #Should not produce an exception but it's there just in case
    try:
        s3Del = s3File.delete()

        #delete entry from database
        cur.execute('DELETE FROM files WHERE file_path=\'%s\'' % (request.form['file']))
        db.commit()
    except Exception as e:
        print(e)

    return jsonify({'message': 'Successful delete', 'success': 'true'})

## Admin and API endpoints

# Verifies and returns the user data from the JWT token
@app.route('/api/email', methods=['GET'])
def userEmail():
    if (tokenValid(request.headers['Authorization'])):
        token = jwt.decode(request.headers['Authorization'], app.config['SECRET_KEY'],algorithms=['HS256'])
        userTable = dynamoDbGetTable('users')
    
        # Check if email is in user table
        res = userTable.get_item(Key={'email': token['sub']['email']})
        if ('Item' in res):
            return jsonify({'message': 'Successful email', 'success': 'true', 'email': token['sub']['email'], 'first_name': res['Item']['first_name'], 'last_name': res['Item']['last_name']})
    return jsonify({'message': 'Failed email', 'success': 'false'})

# Common AWS commands
def s3GetObject(object:str):
    s3 = awsSession.resource('s3')
    return s3.Object(app.config['BUCKET_NAME'], object)

def dynamoDbGetTable(table:str):
    dynamoDb = awsSession.resource('dynamodb', region_name='us-west-2', endpoint_url='http://localhost:8000')
    return dynamoDb.Table(table)


# Checks if token is valid or expired
def tokenValid(token):
    try:
        token = jwt.decode(token, app.config['SECRET_KEY'],algorithms=['HS256'])
    except Exception as e:
        return False
    return True

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
