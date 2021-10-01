import unittest
import json

class TwitterUserTests(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TwitterUserTests, self).__init__(*args, **kwargs)
        self.testUser = 'Placeholder'

    # Should pass because the function requires input for the parameter
    def testPostEmpty(self):
        self.assertRaises(Exception, self.testUser.post_tweet_text, '')

    # Tests user login input variations and user info update
    def testUserLogin(self):
        self.assertRaises(Exception, self.testUser.call('login', 'a@gmail.com', 'jv9k3nG%9dcn@'))
        self.assertRaises(Exception, self.testUser.call('login', 'a@gmail.com', 'test'))
        self.assertRaises(Exception, self.testUser.call('login', 'b@gmail.com', 'flkadj'))
        self.assertRaises(Exception, self.testUser.call('login', 'b@gmail.com', 'test'))
        self.assertRaises(Exception, self.testUser.call('login', 'a@gmail.com', 'First', 'Last', 'old hash', 'new hash', 'register date', 'modify date'))
    
    # Tests user registration and deletion
    def testUserRegistration(self):
        self.assertRaises(Exception, self.testUser.call('register', 'c@gmail.com', 'First', 'Last', 'hash', 'register date'))
        self.assertRaises(Exception, self.testUser.call('register', 'c@gmail.com', 'First2', 'Last2', 'hash2', 'register date'))
        self.assertRaises(Exception, self.testUser.call('delete', 'c@gmail.com', 'hash'))

    # Tests file upload, update, and delete
    def testFileUpload(self):
        self.assertRaises(Exception, self.testUser.call('upload', 'file'))
        self.assertRaises(Exception, self.testUser.call('upload', 'file', 'id'))
        self.assertRaises(Exception, self.testUser.call('delete', 'file'))


unittest.main()