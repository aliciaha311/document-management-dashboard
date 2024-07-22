# Document Management  Application
This is my submission for the Junior Software Developer Take-Home Test. This project demonstrates how to **build a mock RESTful API** using Python and Flask, and includes endpoints for retrieving user data, statistics, and documents. This project also demonstrates vanilla JS to create a **front-end application** to display all information provided by the API.

Last updated: `July 21st, 2024`

## Table of Contents
* [Mock RESTful API](#mock-restful-api)
* [Front-End Application](#front-end-application)
* [Known Issues and Testing Challenges](#testing-challenges)
* [Other Notes](#other-notes)

### Installation
1. Clone the repository: https://github.com/aliciaha311/document-management-dashboard
2. Install dependencies.

## Mock RESTful API
### Prerequisites
- Python 3.x
- Flask
- Flask-Restful
- Flask-CORS
#### For Testing
- Unittest
- Unittest.Mock

### Configuration
CORS origin is configured to allow requests from `http://127.0.0.1:3000`.

### How to Use
1. Start the Flask server: `python app.py`
2. API Endpoints:
- `/user` (**GET**): returns **user information** as a JSON file.
- `/stats` (**GET**): returns overall document **statistics** as a JSON file.
- `/documents` (**GET**): returns the list of **documents** as a JSON file.
- `/documents/{id}` (**PUT**): updates a document's **status** (valid statuses: In Draft, In Review, Pending Approval, Complete).
#### Testing
- Run `python app_test.py` into the terminal.

### File Structure
- `app.py`: Main application file
- `jr_data.json`: JSON data file for user, stats, and documents.
#### Testing
- `app_test.py`: Testing for the mock API.

### Other Notes
- The basic testing is under the assumption that the jr_data.json is used every time.

## Front-End Application
### Configuration
Ensure the mock API (`http://127.0.0.1:5000`) is running before starting the application.

### How to Use
Go to `http://127.0.0.1:3000` to view the website.
#### Testing
- Run `node document-manager-app.js test` into the terminal.

### File Structures
- `document-manager-app.js`: Main application file that communicates with the API. Front-end testing is built into the file via the `test()` function.
- `index.html`: Provides the structure for displaying user information, statistics, and documents dynamically fetched from the API from `document-manager-app.js`. This file includes an error message page that replaces the content when the server is unavailable, preventing users from accessing the main website.
- `style.css`:  Defines styles to reset default browser margins, styles the headers, main sections, and tables.

## Test Cases

### Mock API
- **`test_get_user`**: Verifies the `/user` endpoint returns the correct user information. The response should have a status code of 200 and match the predefined user data.
- **`test_get_stats`**: Confirms the `/stats` endpoint returns accurate statistics. The response should have a status code of 200 and contain the correct statistical data.
- **`test_get_documents`**: Ensures the `/documents` endpoint returns the correct list of documents. The response should have a status code of 200 and match the predefined document list.
- **`test_status_change_valid_status_and_id`**: Validates that the /documents/{id} endpoint successfully updates the status of a document with the specified ID. It checks that the status change is accurately reflected in both the document list and the statistics, and expects a successful response with a status code of 200.
- **`test_status_change_invalid_status`**: Checks that an attempt to update a document with an invalid status returns a 400 error.
- **`test_status_change_invalid_id`**: Verifies that updating a non-existent document returns a 404 error.

### Front-End Application
- **`getUserInfo()`**: Validates that the user information fetched via `getUserInfo()` matches expected values (ID, name, email, role). Errors are logged if there are discrepancies.
- **`getStatsInfo()`**: Ensures the statistics fetched via `getStatsInfo()` match expected values (document counts). Errors are logged if there are discrepancies.
- **`testDocumentsInfo()`**: Validates that document details fetched via `getDocumentsInfo()` match expected values (name, status, last edited date) for each document (5 in total). Errors are logged if there are discrepancies.
- **`testStatusChange()`**: Tests that changing a document’s status updates both the status and statistics correctly via `changeDocumentStatus()`. Includes reverting the change and verifying updates.

## Known Issues and Testing Challenges
### Mock API
- No issues running the mock API.
- No issues running the back-end testing.

### Front-End Application
- No issues running the front-end application.
- No issues running the updated front-end testing.

## Other Notes
- The front-end and back-end testing is under the assumption that the jr_data.json is used every time.
- After the useful feedback from my submission from Friday, I have taken a much simpler approach to test within the front-end application Javascript file, rather than an external file that requires a framework to function.
- I am eager to improve my programming skills, learn how to utilize a framework for front-end testing, and welcome any feedback on how to enhance my approach!