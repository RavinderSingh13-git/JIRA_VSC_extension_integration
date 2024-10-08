import * as vscode from 'vscode';
import axios from 'axios';

export function registerCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('infinite-poc.dialog-modal-message', () => {
        vscode.window.showInformationMessage('Welcome to Singh\'s Extension/Plugin:', {
            modal: true,
            detail: 'Please select software which you want to deal with?'
        }, 'JIRA', 'SNOW', 'Confluence', 'github').then(result => processUserSelection(result, context));
    }));
}

async function processUserSelection(selection: string | undefined, context: vscode.ExtensionContext) {
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
                const panel = vscode.window.createWebviewPanel(
                    'createJiraStory',
                    'Create JIRA Story',
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true
                    }
                );

                panel.webview.html = getWebviewContent(panel.webview);
                panel.webview.onDidReceiveMessage(async message => {
                    if (message.command === 'createJiraStory') {
                        await createJiraStory(message.summary, message.description);
                    }
                });
            }
        });
    }

    if (selection === 'SNOW') {
        vscode.window.showInformationMessage('Choose an action:', {
            modal: true,
            detail: 'What operation you want to perform on SNOW from VSCode?'
        }, 'Fetch incident', 'Create incident', 'Fetch change ticket','Create change ticket').then(async (action) => {
            if (action === 'Fetch incident') {
                const ticketNumber = await vscode.window.showInputBox({
                    prompt: 'Enter the ticket number',
                    placeHolder: 'e.g. INC12345678'
                });

                if (ticketNumber) {
                    fetchSnowTicket(ticketNumber);
                }
            }
        });
    }

}

function getWebviewContent(webview: vscode.Webview): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Create JIRA Story</title>
        </head>
        <body>
            <h1>Create JIRA Story</h1>
            <form id="jiraForm">
                <label for="summary">Summary:</label><br>
                <input type="text" id="summary" name="summary"><br>
                <label for="description">Description:</label><br>
                <textarea id="description" name="description"></textarea><br>
                <button type="button" onclick="createJiraStory()">Create Story</button>
            </form>
            <script>
                const vscode = acquireVsCodeApi();

                function createJiraStory() {
                    const summary = document.getElementById('summary').value;
                    const description = document.getElementById('description').value;
                    vscode.postMessage({
                        command: 'createJiraStory',
                        summary: summary,
                        description: description
                    });
                }
            </script>
        </body>
        </html>
    `;
}

async function fetchJiraStory(storyNumber: string) {
    const jiraBaseUrl = 'https://princeravinderias3.atlassian.net';
    const jiraApiEndpoint = `/rest/api/2/issue/${storyNumber}`;
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
        let errorMessage = 'Failed to fetch JIRA story';
        if (axios.isAxiosError(error)) {
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
                if (error.response.data && typeof error.response.data === 'string') {
                    errorMessage += ` - ${error.response.data}`;
                } else if (error.response.data && typeof error.response.data === 'object') {
                    errorMessage += ` - ${JSON.stringify(error.response.data)}`;
                }
            } else if (error.request) {
                errorMessage += ': No response received from server';
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
        } else if (error instanceof Error) {
            // General error handling for other types of errors
            errorMessage += `: ${error.message}`;
        } else {
            errorMessage += `: ${JSON.stringify(error)}`;
        }
        vscode.window.showErrorMessage(errorMessage);
    }
}

async function createJiraStory(summary: string, description: string) {
    const jiraBaseUrl = 'https://princeravinderias3.atlassian.net';
    const jiraApiEndpoint = '/rest/api/2/issue';
    const jiraUsername = 'princeravinderias3@gmail.com';
    const jiraApiToken = 'ATATT3xFfGF0gvh7SKxc1Y5oDV7tHbU8HFhtTI7_Ni0aTsAi4SSC_o23D-V-Fi9IoJbMZVe-1GRx-TwyVXx3NJ96d2qj_m3E9ZKLqqdBq6MSa3WS5FoQIpAMNtupaJXAVRQgjR_2XXHmDtdcKRxxcjUcPjR2J4n0-SRHGP5TogC8y2pnh8t1nMg=B9A5CB87';

    const newStoryData = {
        "fields": {
           "project": {
              "id": "10000"
           },
           "summary": summary,
           "description": description,
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
        let errorMessage = 'Failed to fetch JIRA story';
        if (axios.isAxiosError(error)) {
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
                if (error.response.data && typeof error.response.data === 'string') {
                    errorMessage += ` - ${error.response.data}`;
                } else if (error.response.data && typeof error.response.data === 'object') {
                    errorMessage += ` - ${JSON.stringify(error.response.data)}`;
                }
            } else if (error.request) {
                errorMessage += ': No response received from server';
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage += `: ${error.message}`;
        } else {
            errorMessage += `: ${JSON.stringify(error)}`;
        }
        vscode.window.showErrorMessage(errorMessage);
    }
}


// Fetching SNOW ticket function from here.....
async function fetchSnowTicket(ticketNumber: string) {
    const SnowBaseUrl = 'https://dev278506.service-now.com';
    const SnowApiEndpoint = `/api/now/table/incident?sysparm_query=number=${ticketNumber}`;
    const SnowUsername = 'admin';
    const SnowApiToken = 'dG%zUm^10sGH';

    try {
        const response = await axios.get(`${SnowBaseUrl}${SnowApiEndpoint}`, {
            auth: {
                username: SnowUsername,
                password: SnowApiToken
            }
        });

        const ticketDetails = response.data;
        vscode.window.showInformationMessage(`INC ticket details: ${JSON.stringify(ticketDetails)}`);
    } catch (error) {
        let errorMessage = 'Failed to fetch SNOW incident ticket';
        if (axios.isAxiosError(error)) {
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
                if (error.response.data && typeof error.response.data === 'string') {
                    errorMessage += ` - ${error.response.data}`;
                } else if (error.response.data && typeof error.response.data === 'object') {
                    errorMessage += ` - ${JSON.stringify(error.response.data)}`;
                }
            } else if (error.request) {
                errorMessage += ': No response received from server';
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage += `: ${error.message}`;
        } else {
            errorMessage += `: ${JSON.stringify(error)}`;
        }
        vscode.window.showErrorMessage(errorMessage);
    }
}



