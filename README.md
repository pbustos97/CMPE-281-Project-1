# Cloud File Storage Solution
### [Project link](http://files.patrickdbustos.link)
### [Documentation](https://docs.google.com/document/d/1_-1zj7hUui5nA1PMoKc1ToataLB7nLKNUAqtbVXt8go/edit?usp=sharing)

## [San Jose State University](http://www.sjsu.edu/)
## Course: [Cloud Technologies](http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE281.html)
## Professor: [Sanjay Garje](https://www.linkedin.com/in/sanjaygarje/)
## Student: [Patrick Bustos](https://www.linkedin.com/in/patrickdbustos/)
## Project Introduction
This project mimics a typical SaaS Cloud File Service such as Google Drive and Dropbox. It was created with Amazon AWS, React.JS, and Python. 
Each user is allowed to upload files as long as it's less than 10 MB in size. Admins are allowed to see every file uploaded and delete the file.
## Screenshots
- Home Page
  - Not Logged In ![Not Logged In](https://i.imgur.com/GL8Ujrg.png)
  - Logged In ![Logged In](https://imgur.com/GbaPrzo.png)
- Login/Register
  ![](https://imgur.com/6WFmcER.png)
  ![](https://imgur.com/NH8t9Hc.png)
- Profile
  ![](https://imgur.com/M9zaaTZ.png)
- Admin
  ![](https://imgur.com/gLDGagE.png)
  ![File delete](https://imgur.com/P9PvhJi.png)
  ![File edit](https://imgur.com/4zs7GbL.png)
# Pre-requisites to setup
- AWS Services for production
  - AWS S3, Transfer Acceleration
  - AWS CloudFront
  - AWS Lambda
  - AWS EC2, ELB, and Autoscaling Groups
  - AWS RDS, RDS Read Replicas
  - AWS DynamoDB
  - AWS SNS
  - AWS SES
  - AWS CloudWatch
  - AWS Route 53
- Software for testing locally
  - Amazon's NoSQL Workbench
  - MySQL
  - Node.JS
  - Python 3.8 with pip installed for requirements.txt
  - Docker for locally hosting Jenkins and DynamoDB
  - Jenkins for CI/CD of React.JS builds
  - AWS CLI and plugins for Visual Studio Code
# How to test locally
  1. Install pre-requisite software
  2. Create a MySQL table named `files` inside of any MySQL database
  3. Setup AWS Credentials, CloudFront, and S3 to test
      - Credentials can be setup using `aws configure` in a command line interface
        - [How to setup credentials with AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
        - A profile should be used to specify which AWS account will run the code
      - Create a new S3 bucket using the AWS CLI
        - The bucket should be public with the bucket policy only allowing the account and account roles that are linked to the credentials access to the S3 functions
      - Create a new CloudFront distribution and link it to the created bucket
  4. Setup a local DynamoDB instance using [Docker](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
      - Setup a new table using NoSQL workbench called `users`. This will hold all the user's data except for files they upload
  5. Inside of the backend folder run `pip3 install -r requirements.txt`
      - If it doesn't install all packages correctly, `pip3 install flask boto3 bcrypt flask-cors flask-jwt-extended mysql-connection-python`
          - If that doesn't work try installing all the space separated packages one by one
  6. Inside of the frontend folder run `npm i`
  7. Inside of the backend folder, create a `.env` file and fill it with the following information in order, following the `.env.example` file
      - localhost
      - whatever your MySQL root user is 
      - whatever your MySQL root password is
      - the database that you set the table `files` in
      - a secret key, doesn't matter what's in it
      - the AWS S3 bucket you created
      - The CloudFront domain that points to the S3 bucket
      - localhost for the DynamoDB process that's running inside of a Docker instance
      - the profile name you set up for AWS credentials
  8. Inside of the frontend folder, create a `.env` file and copy the contents of the `.env.example` file
  9. Have a Docker DynamoDB instance and MySQL running in the background and run the following
      - Inside of the backend folder run `flask run`
      - Inside of the frontend folder run `npm start`
  10. (Optional) Lambda function, SES, and SNS
      1. Create a DynamoDB database
      2. Create a lambda function that will be in the same region as the DynamoDB database
        - IAM role needs full access to DynamoDB, SES, and SNS
      3. Copy and paste the lambda code from this repository into the new lambda function
      4. Create an email to test the SES function with
      5. Create a SNS topic to get notifications about the lambda function
      6. Link Lambda function source to DynamoDB and the destination to the SNS topic
      
      
### UX bugs
- Have to load main URL again in order to use the application after a page reload or redirect
  - Has to do with how npm builds a react app, builds a single page instead of multiple pages for each URL path
      - Webpack required to fix
- Editing the file with a single character doesn't edit the file description
  - Might have to do with JS state variable assignment being delayed

### Backend bugs
- File deletion endpoint always returns a success because of how the boto3 AWS wrapper works for S3 file deletion
  - Need to write exceptions to handle files not existing
