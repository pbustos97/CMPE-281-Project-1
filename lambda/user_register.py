import json
import boto3

def lambda_handler(event, context):
    session = boto3.session.Session()
    dynamoClient = boto3.client('dynamodbstreams')
    emailClient = boto3.client('ses')
    for event in event['Records']:
        #print(event)
        if event['eventName'] == 'INSERT':
            table = event['dynamodb']
            email = table['NewImage']['email']['S']
            first_name = table['NewImage']['first_name']['S']
            last_name = table['NewImage']['last_name']['S']
            try:
                emailClient.send_email(Source='changeLater',
                                Destination={
                                    'ToAddresses': [
                                        email,
                                        ]
                                },
                                Message={
                                    'Subject': {
                                        'Data': 'Thank you for registering at files.patrickdbustos.link!',
                                        'Charset': 'UTF-8'
                                    },
                                    'Body': {
                                        'Text': {
                                            'Data': f'Hello {first_name} {last_name},\nThank you for registering with us!',
                                            'Charset': 'UTF-8'
                                        }
                                    }
                                })
            except Exception as e:
                return {
                    'statusCode': 500,
                    'body': str(e)
                }
    return {
        'statusCode': 200,
        'body': json.dumps('Successful email sent')
    }
