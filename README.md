# Document Management  Application
This is my submission for the Junior Software Developer Take-Home Test. This project demonstrates my attempt on **building a mock RESTful API** using Python and Flask, and includes endpoints for retrieving user data, statistics, and documents. This project also demonstrates vanilla JS to create a **front-end application** to display all information provided by the API.

## Table of Contents
* [Mock API](#mock-restful-api)
* [Front-End Application](#front-end-application)
* [Known Issues and Testing Challenges](#known-issues-and-testing-challenges)
    * [Testing Challenges](#testing-challenges)
    * [Testing Approach](#testing-approach)
* [Other Notes](#other-notes)

### Installation
1. Clone the repository: https://github.com/aliciaha311/document-management-dashboard
2. Install dependencies (`npm install`, other dependencies are specified in their respective sections).

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

### File Structure
- `app.py`: Main application file
- `jr_data.json`: JSON data file for user, stats, and documents.
#### Testing (`__test__`)
- `__test__/app_test.py`: Testing for the mock API.

### Other Notes
- The basic testing is under the assumption that the jr_data.json is used every time.

## Front-End Application
### Prerequisites
#### For Testing
Please refer to `package.json` for all of the dependencies used with versions used for this project.

### Configuration
Ensure the mock API (`http://127.0.0.1:5000`) is running before starting the application.

### How to Use
Go to `http://127.0.0.1:3000` to view the website.
#### Testing
- Ensure that you have Node.js and npm installed on your machine: `npm install`.
- To run the testing, input `npm test` to the terminal.

### File Structure
- `document-management-app.js`: Main application file that communicates with the API.
- `index.html`: Provides the structure for displaying user information, statistics, and documents dynamically fetched from the API from `document-management-app.js`.
- `style.css`:  Defines styles to reset default browser margins, styles the headers, main sections, and tables.
#### Testing (`__test__`)
- `app.test.js`: Testing for the front-end application.
- `jest-preset.js`, `jest.config.cjs`, `babel.config.cjs`, `setupTests.js` are all files to ensure that Jest is able to function.

## Known Issues and Testing Challenges
### Mock API
- No issues running the mock API.
- No issues running the basic testing.

### Front-End Application
- No issues running the front-end application.

### Testing Challenges:
- I was unable to get the front-end tests to run successfully.
- The test setup involves importing the HTML file straight from the website, and testing the content of each of the elements, since the HTML directly displays the output of the Javascript application.
- Despite attempts to implement delays for asynchronous functions, the tests do not execute correctly as attempting to fetch the HTML always returns null.
- This is my first experience with front-end testing, and I encountered challenges in setting up and executing the tests effectively.

### Testing Approach
- The function `fetchHTMLfromWebsite()` aims to fetch the HTML content from the website `http://127.0.0.1:3000`.
- JSDOM is used to create a simulated browser environment with the now fetched HTML content for each test.

The test cases are as below:
- Verifying the correct user information is displayed on the website.
- Verifying the correct staistics information is displayed on the website.
- Verifying the correct documents information is displayed on the website.
- Updating the status of one of the documents and verifying that the document's status and the statistics count is changed and correct.

## Other Notes
- The basic testing is under the assumption that the jr_data.json is used every time.
- I have documented my testing efforts and challenges thoroughly in `app.test.js`.
- This is my first experience with front-end testing and back-end testing with Python, and I plan to continue working on resolving the front-end testing issues to ensure comprehensive test coverage, and enhance the testing of the back-end.
- I am eager to improve my testing skills and welcome any feedback on how to enhance my approach!
