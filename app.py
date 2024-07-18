#todo: make sure that coding quality is good and add testing!

import json
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})
api = Api(app)

try:
    with open('jr_data.json', 'r') as file:
        data = json.load(file)

    user = data.get('user')
    stats = data.get('stats')
    documents = data.get('documents')
except FileNotFoundError:
    user = None
    stats = None
    documents = None
    print("The file jr_data.json was not found.")
except json.JSONDecodeError:
    user = None
    stats = None
    documents = None
    print("Error decoding JSON from jr_data.json.")

class User(Resource):
    def get(self):
        return user
    
class Stats(Resource):
    def get(self):
        return stats
    
class DocumentList(Resource):
    def get(self):
        return documents
    
#will fix this later
class DocumentStatus(Resource):
    def put(self, id):
        json_data = request.get_json()

        if not json_data:
            return {'message': 'No input data provided'}, 400
        
        # Extract the 'status' field from the JSON data
        new_status = json_data.get('status')
        if not new_status:
            return {'message': 'Status field is required in JSON input'}, 400

        document_found = False
        for doc in documents:
            if doc['id'] == id:
                doc['status'] = new_status
                document_found = True

        if not document_found:
            return {'message': 'Document not found'}, 404
        
        try:
            data['documents'] = documents
            with open('jr_data.json', 'w') as file:
                json.dump(data, file, indent=3)
        except Exception as e:
            return {'message': 'Error saving new status to document.'}, 500

        return {'message': f'Document {id} updated successfully', 'document': doc}, 200
        

 
api.add_resource(User, '/user')
api.add_resource(Stats, '/stats')
api.add_resource(DocumentList, '/documents')
api.add_resource(DocumentStatus, '/documents/<int:id>')

# driver function 
if __name__ == '__main__': 
    app.run(debug = True)