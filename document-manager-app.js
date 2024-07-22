//Defines the base URL for API requests
const apiUrl = 'http://127.0.0.1:5000';

// Checking if server is on or off to either show error message or content
function checkServerStatus(online) {
    console.log("Online = " + online)
    
    if (online === true){
        document.getElementById('content').style.display = 'block';
        document.getElementById('error-message').style.display = 'none';
    } else {
        document.getElementById('content').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
    }
}

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
        if (typeof document !== 'undefined'){
            const {id, name, email, role} = userInfo;

            document.getElementById('user-id').textContent = id;
            document.getElementById('user-name').textContent = name;
            document.getElementById('user-email').textContent = email;
            document.getElementById('user-role').textContent = role;

            console.log("User information is received successfully.");
        }
        return userInfo;
    } catch (error){
        console.error("Error fetching user information:", error);
        online = false;
        return null;
    }
}

//Function to fetch statistics information from API
async function getStatsInfo(){
    try {
        const response = await fetch(apiUrl + '/stats');
        const statsInfo = await handleFetchErrors(response, "Unable to access JSON and update stats information.");

        //Updates stats information in the HTML
        if (typeof document !== 'undefined'){
            const {totalDocuments, inDraft, inReview, pendingApproval, complete} = statsInfo;
            
            document.getElementById('total-documents').textContent = totalDocuments;
            document.getElementById('in-draft').textContent = inDraft;
            document.getElementById('in-review').textContent = inReview;
            document.getElementById('pending-approval').textContent = pendingApproval;
            document.getElementById('complete').textContent = complete;

            console.log("Stats information is received.");
        }

        return statsInfo;
    } catch (error){
        console.error("Error fetching stats information:", error);
        return null;
    }
}

//Function to fetch documents information from API
async function getDocumentsInfo(){
    try {
        const response = await fetch(apiUrl + '/documents');
        const documentsList = await handleFetchErrors(response, "Unable to access JSON and update document information.");

        //Updates documents information in the HTML
        if (typeof document !== 'undefined'){
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
        }

        return documentsList;
    } catch (error){
        console.error("Error fetching document information:", error);
        return null;
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
        await getStatsInfo(); //Refresh statistics information after updating document status
    } catch (error){
        console.error("Error updating document status:", error);
    }
}

//Event listener to fetch initial data when document is available and the DOM content is loaded
if (typeof document != 'undefined'){
    document.addEventListener("DOMContentLoaded", async function() {
        const userInfo = await getUserInfo();
        const statsInfo = await getStatsInfo();
        const documentsInfo = await getDocumentsInfo();

        if (userInfo !== null && statsInfo !== null && documentsInfo !== null){
            checkServerStatus(true);
            console.log("Currently true");
        }
        else {
            checkServerStatus(false);
            console.log("Currently false");
        }
    });
}

// Function used by test cases to validate values based on expected data
function validate(value, expected, name){
    if (value === expected){ console.log(`${name} is correct!`) }
    else { console.error(`Error: ${name} does not match. [Output = ${value}, Expected = ${expected}]`)}
}

// Function to validate user information
async function testUserInfo() {
    try {
        console.log("Testing user information...");

        const userInfo = await getUserInfo();
        
        if (userInfo == null){
            console.log("Error: Returned user data is null. Please make sure the server is still on and jr_data.json is in the correct directory.");
        }
        else {
            console.log("Data retrieved successfully by test.");
            const {id, name, email, role} = userInfo;

            validate(id, 1, 'ID');
            validate(name, 'John Doe', 'Name');
            validate(email, 'john.doe@example.com', 'Email address');
            validate(role, 'Admin', 'Role');
        }
        console.log("-----------------------\n");
    }
    catch (error){
        console.error('Error:', error);
    }
}

// Test case: Fetch and validate statistics information
async function testStatsInfo() {
    try {
        console.log("Testing statistics information...");

        const statsInfo = await getStatsInfo();
        
        if (statsInfo == null){
            console.error("Error: Returned statsitics data is null. Please make sure the server is still on and jr_data.json is in the correct directory.");
        }
        else {
            console.log("Data retrieved successfully by test.");
            const {totalDocuments, inDraft, inReview, pendingApproval, complete} = statsInfo;

            validate(totalDocuments, 5, 'Total number of documents');
            validate(inDraft, 1, 'Number of in-draft documents');
            validate(inReview, 1, 'Number of in-review documents');
            validate(pendingApproval, 1, 'Number of documents pending approval');
            validate(complete, 2, 'Number of completed documents');
        }

        console.log("-----------------------\n");
    }
    catch (error){
        console.error('Error:', error);
    }
}

// Function used by testDocumentsInfo() to validate values based on expected data
// Has a different console.error message compared to validate() to specify document and specifc part with the error
function validateDocument(id, value, expected, name){
    if (value !== expected){
        console.error(`Document ${id}'s ${name} does not match. [Output = ${value}, Expected = ${expected}]`);
        return false;
    }
    return true;
}

// Test Case: Fetch and validate documents information
async function testDocumentsInfo() {
    try {
        console.log("Testing documents information...");

        const documentsList = await getDocumentsInfo();
        
        if (documentsList === null){
            console.error("Error: Returned statsitics data is null. Please make sure the server is still on and jr_data.json is in the correct directory.");
        }
        else {
            const documentNames = ["Project Proposal", "Quarterly Report", "Marketing Plan", "Development Approach", "Personnel Overview"];
            const documentStatuses = ["In Review", "Pending Approval", "In Draft", "Complete", "Complete"];
            const documentDates = ["2024-06-10", "2024-06-08", "2024-06-12", "2024-06-08", "2024-06-04"];

            console.log("Data retrieved successfully by test.");

            let correct = false;

            documentsList.forEach(documentInfo => {
                const {id, name, status, lastEdited} = documentInfo;

                if(validateDocument(id, name, documentNames[id - 1], "name") && validateDocument(id, status, documentStatuses[id - 1], "status") && validateDocument(id, lastEdited, documentDates[id - 1], "last edited date")){
                    console.log(`All information in Document ${id} is correct!`);
                }
            });
        }

        console.log("-----------------------\n");
    }
    catch (error){
        console.error('Error:', error);
    }
}

// Test Case: change document status and validate updates to status name and statistics
async function testStatusChange() {
    try {
        console.log("Testing status changes...\n");

        let documentsList = await getDocumentsInfo();
        let statsInfo = await getStatsInfo();

        let change = false;

        if (documentsList === null) {
            console.error("Error: Cannot change status. Please make sure the server is still on and jr_data.json is in the correct directory.");
        } else {
            console.log('Changing the status of Document 2 from "Pending Approval" to "In Draft":');

            // Change document 2's status
            await changeDocumentStatus(2, "In Draft");

            // Re-fetch document list and stats
            documentsList = await getDocumentsInfo();
            statsInfo = await getStatsInfo();

            // Validate status change and statistics update
            if (documentsList.find(doc => doc.id == 2).status == "In Draft") {
                console.log('Status changed to "In Draft" successfully!');
                change = true;
            } else {
                console.error("Error: status did not change. Please try again.");
            }

            if (statsInfo.inDraft === 2 && statsInfo.pendingApproval === 0) {
                console.log("Statistics changed successfully!");
            } else {
                console.error("Statistics incorrectly updated.");
                change = false;
            }

            // Revert status change
            if (change === true) {
                console.log('\nChanging the status of Document 2 back from "In Draft" to "Pending Approval":');

                await changeDocumentStatus(2, "Pending Approval");

                // Re-fetch document list and stats after the change
                documentsList = await getDocumentsInfo();
                statsInfo = await getStatsInfo();

                // Validate that status change and statistics are reverted
                if (documentsList.find(doc => doc.id == 2).status === "Pending Approval") {
                    console.log('Status changed back to "Pending Approval" successfully!');
                } else {
                    console.error("Error: status did not change. Please try again.");
                }

                if (statsInfo.inDraft === 1 && statsInfo.pendingApproval === 1) {
                    console.log("Statistics changed back successfully!");
                } else {
                    console.error("Statistics incorrectly updated.");
                }
            }
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}

// Run all test cases
async function test() {
    await testUserInfo();
    await testStatsInfo();
    await testDocumentsInfo();
    await testStatusChange();
}

// Start testing if the script is run with the 'test' argument
if (typeof process !== 'undefined' && process.argv.includes('test')) {
    console.log("\nSTART OF TESTING\n")
    test();
}