//todo: make sure that coding quality is good and add testing!

const apiUrl = 'http://127.0.0.1:5000';

async function getUserInfo(){
    try {
        const response = await fetch(apiUrl + '/user');
        
        if (!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        userInfo = await response.json();
        console.log("User information is received.");

        const {id, name, email, role} = userInfo;

        document.getElementById('user-id').textContent = id;
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-email').textContent = email;
        document.getElementById('user-role').textContent = role;

    } catch (error){
        console.error("Unable to access JSON and update user information.");
    }
}

async function getStatsInfo(){
    try {
        const response = await fetch(apiUrl + '/stats');
        
        if (!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        statsInfo = await response.json();
        console.log("Stats information is received.");

        const {totalDocuments, inDraft, inReview, pendingApproval, complete} = statsInfo;

        document.getElementById('total-documents').textContent = totalDocuments;
        document.getElementById('in-draft').textContent = inDraft;
        document.getElementById('in-review').textContent = inReview;
        document.getElementById('pending-approval').textContent = pendingApproval;
        document.getElementById('complete').textContent = complete;

    } catch (error){
        console.error("Unable to access JSON and update user information.");
    }
}

async function getDocumentsInfo(){
    try {
        const response = await fetch(apiUrl + '/documents');
        
        if (!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        documentsList = await response.json();
        console.log("Document information is received.");

        const documentsSection = document.getElementById('documents-list');

        documentsList.forEach(documentInfo => {
            const {id, name, status, lastEdited} = documentInfo;
            console.log(documentInfo);

            let documentTableRow = document.createElement('tr');

            documentTableRow.innerHTML = `
                <th>${id}</th>
                <th>${name}</th>
                <th>
                    <select class="status" id="documentStatus${id}">
                        <option value="In Draft">In Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Complete">Complete</option>
                    </select>
                <th>
                <th>${lastEdited}</th>
            `;

            document.getElementById('documents-table').appendChild(documentTableRow);
            document.getElementById('documentStatus' + id).value = status;
            document.getElementById('documentStatus' + id).addEventListener('change', function() {
                changeDocumentStatus(id, this.value);
            })
    });

    } catch (error){
        console.error("Unable to access JSON and update user information.");
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

        const responseData = await response.json();

        if (!response.ok){
            console.error('Error:', responseData.message);
        } else {
            console.error('Success:', responseData.message);
        }
    }
    catch (error){
        console.error("Unable to update the status of the document:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    getUserInfo();
    getStatsInfo();
    getDocumentsInfo();
});
