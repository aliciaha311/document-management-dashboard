import unittest
import json
from app import app
import shutil
import os

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Backup the original data file before each test
        if not os.path.exists('jr_data_backup.json'):
            shutil.copy('jr_data.json', 'jr_data_backup.json')

    def restore(self):
        # Restore the original data file after each test
        shutil.copy('jr_data_backup.json', 'jr_data.json')

    def test_get_user(self):
        response = self.app.get('/user')

        expected_data = {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com",
            "role": "Admin"
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), expected_data, "Test to use GET method with /user failed.")

    def test_get_stats(self):
        response = self.app.get('/stats')

        expected_data = {
            "totalDocuments": 5,
            "inDraft": 1,
            "inReview": 1,
            "pendingApproval": 1,
            "complete": 2
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), expected_data, "Test to use GET method with /stats failed.")

    def test_get_documents(self):
        response = self.app.get('/documents')

        expected_data = [
            {"id": 1, "name": "Project Proposal", "status": "In Review", "lastEdited": "2024-06-10"},
            {"id": 2, "name": "Quarterly Report", "status": "Pending Approval", "lastEdited": "2024-06-08"},
            {"id": 3, "name": "Marketing Plan", "status": "In Draft", "lastEdited": "2024-06-12"},
            {"id": 4, "name": "Development Approach", "status": "Complete", "lastEdited": "2024-06-08"},
            {"id": 5, "name": "Personnel Overview", "status": "Complete", "lastEdited": "2024-06-04"}
        ]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), expected_data, "Test to use GET method in /documents failed.")


    def test_status_change_valid_status_and_id(self):
        response = self.app.put(
            '/documents/2',
            data=json.dumps({"status": "In Draft"}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200, "Unable to change the status of Document 2.")

        documents_response = self.app.get('/documents')
        stats_response = self.app.get('/stats')

        documents_expected_data = [
            {"id": 1, "name": "Project Proposal", "status": "In Review", "lastEdited": "2024-06-10"},
            {"id": 2, "name": "Quarterly Report", "status": "In Draft",  "lastEdited": "2024-06-08"},
            {"id": 3, "name": "Marketing Plan", "status": "In Draft", "lastEdited": "2024-06-12"},
            {"id": 4, "name": "Development Approach", "status": "Complete", "lastEdited": "2024-06-08"},
            {"id": 5, "name": "Personnel Overview", "status": "Complete", "lastEdited": "2024-06-04"}
        ]

        stats_expected_data = {
            "totalDocuments": 5,
            "inDraft": 2,
            "inReview": 1,
            "pendingApproval": 0,
            "complete": 2
        }

        #tests if the response data matches the expected data
        self.assertEqual(documents_response.status_code, 200, "Unable to find documents list.")
        self.assertEqual(documents_response.get_json(), documents_expected_data, "Test to update status in Document 2 failed.")

        self.assertEqual(stats_response.status_code, 200, "Unable to find statistics.")
        self.assertEqual(stats_response.get_json(), stats_expected_data, "Test to update statistics after status change in Document 2 failed.")

        # Change status back to the original
        self.app.put(
            '/documents/2',
            data=json.dumps({"status": "Pending Approval"}),
            content_type='application/json'
        )

    def test_status_change_invalid_status(self):
        response = self.app.put(
            '/documents/3',
            data=json.dumps({"status": "Invalid Status"}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400, "Document 3 has been updated with an invalid status.")

        self.app.put(
            '/documents/3',
            data=json.dumps({"status": "In Draft"}),
            content_type='application/json'
        )

    def test_status_change_invalid_id(self):
        response = self.app.put(
            '/documents/10',
            data=json.dumps({"status": "In Draft"}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 404, "Document 10 should not be able to be accessed.")

if __name__ == '__main__':
    print("Testing with jr_data.json data:")
    suite = unittest.TestSuite()
    suite.addTest(TestApp('test_get_user'))
    suite.addTest(TestApp('test_get_stats'))
    suite.addTest(TestApp('test_get_documents'))
    suite.addTest(TestApp('test_status_change_valid_status_and_id'))
    suite.addTest(TestApp('test_status_change_invalid_status'))
    suite.addTest(TestApp('test_status_change_invalid_id'))

    runner = unittest.TextTestRunner()
    result = runner.run(suite)

    if result.wasSuccessful():
        print("Passed all tests!")

    print("")