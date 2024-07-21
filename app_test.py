import unittest
from unittest.mock import patch, mock_open
import json
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        print("Testing with jr_data.json data:")

    #testing to see if it works on default values of jr_data.json

    def testGetUser(self):
        response = self.app.get('/user')

        expected_data = {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com",
            "role": "Admin"
        }

        try:
            self.assertEqual(json.loads(response.data), expected_data)
            print("Get User Test passed!")
            
        except AssertionError as e:
            self.fail(f'Get User Test failed \n{str(e)}')

    def testGetStats(self):
        response = self.app.get('/stats')

        expected_data = {
            "totalDocuments": 5,
            "inDraft": 1,
            "inReview": 1,
            "pendingApproval": 1,
            "complete": 2
        }

        #tests if the response data matches the expected data
        try:
            self.assertEqual(json.loads(response.data), expected_data)
            print("Get Stats Test passed!")
        #if not, then test has failed
        except AssertionError as e:
            self.fail(f'Get Stats Test failed \n{str(e)}')

    def testGetDocuments(self):
        response = self.app.get('/documents')

        expected_data = [
            {
                "id": 1,
                "name": "Project Proposal",
                "status": "In Review",
                "lastEdited": "2024-06-10"
            },
            {
                "id": 2,
                "name": "Quarterly Report",
                "status": "Pending Approval",
                "lastEdited": "2024-06-08"
            },
            {
                "id": 3,
                "name": "Marketing Plan",
                "status": "In Draft",
                "lastEdited": "2024-06-12"
            },
            {
                "id": 4,
                "name": "Development Approach",
                "status": "Complete",
                "lastEdited": "2024-06-08"
            },
            {
                "id": 5,
                "name": "Personnel Overview",
                "status": "Complete",
                "lastEdited": "2024-06-04"
            }
        ]

        try:
            self.assertEqual(json.loads(response.data), expected_data)
            print("Get Documents Test passed!")
            
        except AssertionError as e:
            self.fail(f'Get Documents Test failed \n{str(e)}')

if __name__ == '__main__':
    unittest.main()
