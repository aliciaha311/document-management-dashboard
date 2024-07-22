import json
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})
api = Api(app)

try:
    # Attempt to load initial data from jr_data.json
    with open('jr_data.json', 'r') as file:
        data = json.load(file)

    user = data.get('user')
    stats = data.get('stats')
    documents = data.get('documents')
except FileNotFoundError:
    # Handle case where jr_data.json is not found
    user = None
    stats = None
    documents = None
    print("The file jr_data.json was not found.")
except json.JSONDecodeError:
    # Handle case where jr_data.json is invalid JSON
    user = None
    stats = None
    documents = None
    print("Error decoding JSON from jr_data.json.")

# Defining API endpoints
class User(Resource):
    def get(self):
        if user:
            return user, 200
        else:
            return {'message': 'User data not found'}, 404
    
class Stats(Resource):
    def get(self):
        if stats:
            return stats, 200
        else:
            return {'message': 'Stats data not found'}, 404
    
class DocumentList(Resource):
    def get(self):
        if documents:
            return documents, 200
        else:
            return {'message': 'Documents data not found'}, 404
    
class DocumentStatus(Resource):
    def put(self, id):
        input_data = request.get_json()
        if not input_data:
            return {'message': 'No input data provided'}, 400
        
        new_status = input_data.get('status')
        if not new_status:
            return {'message': 'New status is required from JSON file.'}, 400

        # Finds document by ID
        document_found = False
        for doc in documents:
            if doc['id'] == id:
                old_status = doc['status']
                doc['status'] = new_status
                document_found = True
                break

        if not document_found:
            return {'message': 'Document not found. Please make sure that the ID is correct.'}, 404
        
        # Updates the stats count whenever the status of the document changes
        old_status_key = old_status[0].lower() + old_status[1:].replace(" ", "")
        new_status_key = new_status[0].lower() + new_status[1:].replace(" ", "")

        if old_status_key in stats:
            stats[old_status_key] -= 1
        else:
            return {'message': 'Old status does not exist.'}, 400

        if new_status_key in stats:
            stats[new_status_key] += 1
        else:
            return {'message': 'New status does not exist.'}, 400

        #Saves updated data back to jr_data.json
        try:
            data['documents'] = documents
            data['stats'] = stats
            with open('jr_data.json', 'w') as file:
                json.dump(data, file, indent=3)
        except Exception as e:
            return {'message': 'Error saving new status to document.'}, 500

        return {'message': f'Document {id} updated successfully', 'document': doc}, 200

#Add resources to API
api.add_resource(User, '/user')
api.add_resource(Stats, '/stats')
api.add_resource(DocumentList, '/documents')
api.add_resource(DocumentStatus, '/documents/<int:id>')

if __name__ == '__main__': 
    app.run(debug = True)