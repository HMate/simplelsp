// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as net from 'net';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	Trace,
    StreamInfo
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) { 

	console.log('Congratulations, your extension "simplelsp" is now active!');

    let clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            {
                pattern: '**/*.sl',
            }
        ]
    };

    const host = '127.0.0.1';
    const port = 8123;
    let lspClient = new LanguageClient("simplelanguage", "SimpleLang LSP", 
        () => new Promise<StreamInfo>((resolve, reject) => {
            const socket = new net.Socket();
            socket.on('error', (e) => {
                reject(e);
                console.log(`Rejected ${e}`);
            });
            socket.on("data", (data: Buffer) => {
                console.log(`Data recieved from LSPServer: \n${data}`);
            });
            socket.connect(port, host, () => {
                console.log(`Connect ${host}`);
                resolve({
                    reader: socket,
                    writer: socket
                } as StreamInfo);
            });
        }), clientOptions);

    

    // For debugging only
    lspClient.trace = Trace.Verbose;
    context.subscriptions.push(lspClient.start());

    context.subscriptions.push(vscode.commands.registerCommand("simplelanguage.testcommand", sendTestCommand));
    
	console.log('Initialized simplelanguage client');
}

function sendTestCommand() {
    console.log('Sendng test command commenced');
    vscode.commands.executeCommand("VeryCoolCommand").then((res) => {
        console.log(`Got command result: ${res}`);
    });
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
