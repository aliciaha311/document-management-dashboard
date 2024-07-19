//Defines the base URL for API requests
const apiUrl = 'http://127.0.0.1:5000';

//Function to handle fetch errors and parse JSON response
async function handleFetchErrors(response, errorMessage) {
    if (!response.ok) {
        throw new Error(`${errorMessage} HTTP Error! Status: ${response.status}`);
    }
    return response.json();
}

//Function to fetch user information from API
async function getUserInfo(){
    try {
        const response = await fetch(apiUrl + '/user');
        const userInfo = await handleFetchErrors(response, "Unable to access JSON and update user information.");

        //Updates user information in the HTML
        const {id, name, email, role} = userInfo;
        document.getElementById('user-id').textContent = id;
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-email').textContent = email;
        document.getElementById('user-role').textContent = role;

        console.log("User information is received.");
    } catch (error){
        console.error("Error fetching user information:", error);
    }
}

//Function to fetch statistics information from API
async function getStatsInfo(){
    try {
        const response = await fetch(apiUrl + '/stats');
        const statsInfo = await handleFetchErrors(response, "Unable to access JSON and update stats information.");

        //Updates stats information in the HTML
        const {totalDocuments, inDraft, inReview, pendingApproval, complete} = statsInfo;
        document.getElementById('total-documents').textContent = totalDocuments;
        document.getElementById('in-draft').textContent = inDraft;
        document.getElementById('in-review').textContent = inReview;
        document.getElementById('pending-approval').textContent = pendingApproval;
        document.getElementById('complete').textContent = complete;

        console.log("Stats information is received.");
    } catch (error){
        console.error("Error fetching stats information:", error);
    }
}

//Function to fetch documents information from API
async function getDocumentsInfo(){
    try {
        const response = await fetch(apiUrl + '/documents');
        const documentsList = await handleFetchErrors(response, "Unable to access JSON and update document information.");

        //Updates documents information in the HTML
        const documentsSection = document.getElementById('documents-table-body');
        documentsList.forEach(documentInfo => {
            const {id, name, status, lastEdited} = documentInfo;
            let documentTableRow = document.createElement('tr');
            documentTableRow.innerHTML = `
                <th id="document-id${id}">${id}</th>
                <th id="document-name${id}">${name}</th>
                <select class="status" id="document-status${id}">
                    <option value="In Draft">In Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Complete">Complete</option>
                </select>
                <th id="document-date${id}">${lastEdited}</th>
            `;
            document.getElementById('documents-table').appendChild(documentTableRow);
            document.getElementById('document-status' + id).value = status;
            document.getElementById('document-status' + id).addEventListener('change', function() {
                changeDocumentStatus(id, this.value);
            });
        });
        console.log("Document information is received.");
    } catch (error){
        console.error("Error fetching document information:", error);
    }
}

async function changeDocumentStatus(id, status){
    try {
        const response = await fetch (apiUrl + '/documents/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status: status}),
        });

        const responseData = await handleFetchErrors(response, "Unable to update the status of the document.");

        console.log('Success:', responseData.message);
        getStatsInfo(); //Refresh statistics information after updating document status
    } catch (error){
        console.error("Error updating document status:", error);
    }
}

//Event listener to fetch initial data when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    getUserInfo();
    getStatsInfo();
    getDocumentsInfo();
});
