import { commands, ExtensionContext, OutputChannel, window } from 'vscode';
import * as vscode from 'vscode';
import axios from 'axios';

export function registerCommands(context: vscode.ExtensionContext, op: vscode.OutputChannel) {
    context.subscriptions.push(vscode.commands.registerCommand('infinite-poc.dialog-modal-message', () => {
        vscode.window.showInformationMessage('Welcome to Singh\'s Extension/Plugin:', {
            modal: true,
            detail: 'Please select software which you want to deal with?'
        }, 'JIRA', 'SNOW', 'Confluence', 'github').then(result => processUserSelection(result));
    }));
}

async function processUserSelection(selection: string | undefined) {
    if (!selection) {
        return;
    }

    if (selection === 'JIRA') {
        vscode.window.showInformationMessage('Choose an action:', {
            modal: true,
            detail: 'Would you like to fetch or create a JIRA story?'
        }, 'Fetch Story', 'Create Story').then(async (action) => {
            if (action === 'Fetch Story') {
                const storyNumber = await vscode.window.showInputBox({
                    prompt: 'Enter the JIRA story number',
                    placeHolder: 'e.g. JIRA-1234'
                });

                if (storyNumber) {
                    fetchJiraStory(storyNumber);
                }
            } else if (action === 'Create Story') {
                collectJiraStoryDetails();
            }
        });
    }
}

async function collectJiraStoryDetails() {
    const summary = await vscode.window.showInputBox({
        prompt: 'Enter the summary for the new JIRA story'
    });

    if (!summary) {
        vscode.window.showErrorMessage('Summary is required to create a JIRA story.');
        return;
    }

    const description = await vscode.window.showInputBox({
        prompt: 'Enter the description for the new JIRA story'
    });

    if (!description) {
        vscode.window.showErrorMessage('Description is required to create a JIRA story.');
        return;
    }

    const confirm = await vscode.window.showInformationMessage(
        `Summary: ${summary}\nDescription: ${description}\n\nDo you want to create this story?`,
        { modal: true },
        'Yes', 'No'
    );

    if (confirm === 'Yes') {
        createJiraStory({ summary, description });
    }
}

async function fetchJiraStory(storyNumber: string) {
    const jiraBaseUrl = 'https://princeravinderias3.atlassian.net';
    const jiraApiEndpoint = `/rest/api/2/status/${storyNumber}`;
    const jiraUsername = 'princeravinderias3@gmail.com';
    const jiraApiToken = 'ATATT3xFfGF0gvh7SKxc1Y5oDV7tHbU8HFhtTI7_Ni0aTsAi4SSC_o23D-V-Fi9IoJbMZVe-1GRx-TwyVXx3NJ96d2qj_m3E9ZKLqqdBq6MSa3WS5FoQIpAMNtupaJXAVRQgjR_2XXHmDtdcKRxxcjUcPjR2J4n0-SRHGP5TogC8y2pnh8t1nMg=B9A5CB87';

    try {
        const response = await axios.get(`${jiraBaseUrl}${jiraApiEndpoint}`, {
            auth: {
                username: jiraUsername,
                password: jiraApiToken
            }
        });

        const storyDetails = response.data;
        vscode.window.showInformationMessage(`Story details: ${JSON.stringify(storyDetails)}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch JIRA story: ${error.message}`);
    }
}

async function createJiraStory(storyDetails: { summary: string, description: string }) {
    const jiraBaseUrl = 'https://princeravinderias3.atlassian.net';
    const jiraApiEndpoint = '/rest/api/2/issue';
    const jiraUsername = 'princeravinderias3@gmail.com';
    const jiraApiToken = 'ATATT3xFfGF0gvh7SKxc1Y5oDV7tHbU8HFhtTI7_Ni0aTsAi4SSC_o23D-V-Fi9IoJbMZVe-1GRx-TwyVXx3NJ96d2qj_m3E9ZKLqqdBq6MSa3WS5FoQIpAMNtupaJXAVRQgjR_2XXHmDtdcKRxxcjUcPjR2J4n0-SRHGP5TogC8y2pnh8t1nMg=B9A5CB87';

    const newStoryData = {
        "fields": {
           "project":
           {
              "id": "10000"
           },
           "summary": "This is Singh's JIRA story number-20.",
           "description": "Creating of an issue using project keys and issue type names using the REST API",
           "issuetype": {
              "id": "10001" 
           }
       }
    };

    try {
        const response = await axios.post(`${jiraBaseUrl}${jiraApiEndpoint}`, newStoryData, {
            auth: {
                username: jiraUsername,
                password: jiraApiToken
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const createdStory = response.data;
        vscode.window.showInformationMessage(`Created new story: ${JSON.stringify(createdStory)}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create JIRA story: ${error.message}`);
    }
}
