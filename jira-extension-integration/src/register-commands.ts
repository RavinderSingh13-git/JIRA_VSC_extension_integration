import { commands, ExtensionContext, OutputChannel, window } from "vscode";
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

    switch (selection) {
        case 'JIRA':
            const storyNumber = await vscode.window.showInputBox({
                prompt: 'Enter the JIRA story number',
                placeHolder: 'e.g. JIRA-1234'
            });

            if (storyNumber) {
                fetchJiraStory(storyNumber);
            }
            break;
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
