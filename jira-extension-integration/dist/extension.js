/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerCommands = registerCommands;
exports.readSelectedOrAllText = readSelectedOrAllText;
const vscode_1 = __webpack_require__(1);
function registerCommands(context, op) {
    context.subscriptions.push(vscode_1.commands.registerCommand('infinite-poc.dialog-modal-message', () => {
        vscode_1.window.showInformationMessage('Welcome to Singh\'s Extension/Plugin:', {
            modal: true,
            detail: 'Please select software which you want to deall with?'
        }, 'JIRA', 'SNOW', 'Confluence', 'github').then(result => processUserSelection(result));
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('infinite-poc.ask-user', () => {
        vscode_1.window.showInformationMessage('How many cats, do you see 🐈🐈🐈 in the message?', '1', '2', '3', '40')
            .then(result => processUserSelection(result));
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('ipoc.print.explorer.menu', () => {
        readSelectedOrAllText(op);
    }));
}
function readSelectedOrAllText(op) {
    op.clear();
    const { activeTextEditor } = vscode_1.window;
    let txt = '';
    if (!activeTextEditor || activeTextEditor.document.languageId !== 'javascript') {
        op.appendLine('no active found');
    }
    else {
        txt = activeTextEditor.document.getText(activeTextEditor.selection);
        if (!txt) {
            txt = activeTextEditor.document.getText();
        }
        op.appendLine(txt);
    }
    op.show();
    return txt;
}
function processUserSelection(result) {
    if (!result) {
        vscode_1.window.showInputBox({ title: 'please enter your answer here...👇' })
            .then(result => processUserSelection(result));
    }
    else if (result === '3') {
        vscode_1.window.showInformationMessage('Perfect 😸😸😸!');
    }
    else {
        vscode_1.window.showErrorMessage('Wrong 😿😿😿!');
    }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode_1 = __webpack_require__(1);
const register_commands_1 = __webpack_require__(2);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "jira-extension-integration" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const op = vscode_1.window.createOutputChannel('jira-extension-integration');
    (0, register_commands_1.registerCommands)(context, op);
    vscode_1.commands.executeCommand('setContext', 'isPrintContextMenu', true);
    // CustomEvent.customEvent.subscribe(data => window.showInformationMessage('Message from event: ' + data));
    // const disposable = vscode.commands.registerCommand('jira-extension-integration.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World from JIRA_extension integration!');
    // });
    // context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map