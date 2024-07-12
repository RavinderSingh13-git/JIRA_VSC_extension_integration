import { commands, ExtensionContext, OutputChannel, window } from "vscode";

export function registerCommands(context: ExtensionContext, op: OutputChannel) {
    context.subscriptions.push(commands.registerCommand('infinite-poc.dialog-modal-message', () => {
        window.showInformationMessage('Welcome to Singh\'s Extension/Plugin:', {
            modal: true,
            detail: 'Please select software which you want to deall with?'
        }, 'JIRA', 'SNOW', 'Confluence', 'github').then(result => processUserSelection(result));
    }));

    context.subscriptions.push(commands.registerCommand('infinite-poc.ask-user', () => {
        window.showInformationMessage('How many cats, do you see 🐈🐈🐈 in the message?', '1', '2', '3', '40')
            .then(result => processUserSelection(result));
    }));

    context.subscriptions.push(commands.registerCommand('ipoc.print.explorer.menu', () => {
        readSelectedOrAllText(op);
    }));
}

export function readSelectedOrAllText(op: OutputChannel) {
    op.clear();
    const { activeTextEditor } = window;
    let txt = '';
    if (!activeTextEditor || activeTextEditor.document.languageId !== 'javascript') {
        op.appendLine('no active found');
    } else {

        txt = activeTextEditor.document.getText(activeTextEditor.selection);
        if (!txt) { txt = activeTextEditor.document.getText(); }
        op.appendLine(txt);
    }
    op.show();
    return txt;
}

function processUserSelection(result: string | undefined): any {
    if (!result){window.showInputBox({ title: 'please enter your answer here...👇' })
        .then(result => processUserSelection(result));
    }
    else if(result === '3'){window.showInformationMessage('Perfect 😸😸😸!');}
    else{window.showErrorMessage('Wrong 😿😿😿!');}
}
