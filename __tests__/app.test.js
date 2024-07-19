import { fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

let dom;
let container;

/**
 * Function to fetch HTML content from a website.
 * This function fetches HTML content from 'http://127.0.0.1:3000' and handles any errors.
*/
async function fetchHTMLfromWebsite(){
  const url = 'http://127.0.0.1:3000';

  try {
      const response = await fetch(url);

      //Attempt to resolve the issue where htmlContent returns null
      await new Promise(resolve => setTimeout(resolve, 1000));

      const htmlContent = await response.text();

      console.log('HTML content fetched successfully.');
  } catch (error) {
      console.error('Error fetching HTML:', error);
      return null;
  }
}

//Describe block for testing front-end code
describe('Testing Front-End Code', () => {
  //Before starting the tests, initialize JSDOM with fetched HTML content
  beforeAll(async () => {
    const html = await fetchHTMLfromWebsite();
    dom = new JSDOM('html', {
      runScripts: 'dangerously',
      resources: 'usable'
    });
    container = dom.window.document.body;
  });

  //Check if the elements mapped from user information exists and has the correct text content
  it('gets the correct user information and displays it', async() => {
    expect(container).toBeDefined();

    await waitFor(() => {
      const userIdElement = container.querySelector('#user-id');
      expect(userIdElement).not.toBeNull();
      expect(userIdElement.textContent).toBe('1');

      const userNameElement = container.querySelector('#user-name');
      expect(userNameElement).not.toBeNull();
      expect(userNameElement.textContent).toBe('John Doe');

      const userEmailElement = container.querySelector('#user-email');
      expect(userEmailElement).not.toBeNull();
      expect(userEmailElement.textContent).toBe('john.doe@example.com');
      
      const userRoleElement = container.querySelector('#user-role');
      expect(userEmailElement).not.toBeNull();
      expect(userEmailElement.textContent).toBe('Admin');
    });
  });

  //Check if the elements mapped from statistics information exists and has the correct text content
  it('gets the correct statistics information and displays it', async() => {
    expect(container).toBeDefined();

    const totalDocuments = container.querySelector('#total-documents');
    expect(totalDocuments).not.toBeNull();
    expect(totalDocuments.textContent).toBe('5');

    const inDraft = container.querySelector('#in-draft');
    expect(inDraft).not.toBeNull();
    expect(inDraft.textContent).toBe('1');

    const inReview = container.querySelector('#in-review');
    expect(inReview).not.toBeNull();
    expect(inReview.textContent).toBe('1');
    
    const pendingApproval = container.querySelector('#pending-approval');
    expect(pendingApproval).not.toBeNull();
    expect(pendingApproval.textContent).toBe('1');

    const complete = container.querySelector('#complete');
    expect(complete).not.toBeNull();
    expect(complete.textContent).toBe('2');
  });

  //Check if the elements mapped from user information exists and has the correct text content
  it('gets the correct user information and displays it', () => {
    expect(container).toBeDefined();

    const documentNames = ["Project Proposal", "Quarterly Report", "Marketing Plan", "Development Approach", "Personnel Overview"];
    const documentStatuses = ["In Review", "Pending Approval", "In Draft", "Complete", "Complete"];
    const documentDates = ["2024-06-10", "2024-06-08", "2024-06-12", "2024-06-08", "2024-06-04"];

    for (let i = 1; i <= 5; i++){
      const documentIdElement = container.querySelector('#document-id' + i);
      expect(documentIdElement).not.toBeNull();
      expect(documentIdElement.textContent).toBe(i);

      const documentNameElement = container.querySelector('#document-name' + i);
      expect(documentNameElement).not.toBeNull();
      expect(documentNameElement.textContent).toBe(documentNames[i - 1]);

      const documentStatusElement = container.querySelector('#document-name' + i);
      expect(documentStatusElement).not.toBeNull();
      expect(documentStatusElement.textContent).toBe(documentStatuses[i - 1]);

      const documentDateElement = container.querySelector('#document-name' + i);
      expect(documentDateElement).not.toBeNull();
      expect(documentDateElement.textContent).toBe(documentDates[i - 1]);
    }
  });

  it('changes the status of one of the documents correctly and update document stats', async() => {
    expect(container).toBeDefined();

    //As an example, the status of the third document is changed from "In Draft" to "In Review"
    const selectElement = container.querySelector('#document-status3');
    expect(selectElement).not.toBeNull();

    //Simulating changing the value of the select element and check if it has updated correctly
    fireEvent.change(selectElement, {target: {value: 'In Review'}});

    await delay(100);

    expect(selectElement.value).toBe('In Review');
    
    //Check if the statistics updated to take one out from "In Draft" and add it to "In Review"
    const inDraft = container.querySelector('#in-draft');
    expect(inDraft).not.toBeNull();
    expect(inDraft.textContent).toBe('0');

    const inReview = container.querySelector('#in-review');
    expect(inReview).not.toBeNull();
    expect(inReview.textContent).toBe('2');
    
    const pendingApproval = container.querySelector('#pending-approval');
    expect(pendingApproval).not.toBeNull();
    expect(pendingApproval.textContent).toBe('1');

    const complete = container.querySelector('#complete');
    expect(complete).not.toBeNull();
    expect(complete.textContent).toBe('2');
  });
});