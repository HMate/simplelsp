// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	Trace
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) { 

	console.log('Congratulations, your extension "simplelsp" is now active!');
	let serverExe = path.join('/home', 'hmate', 'projects', 'simplelanguage', 'sl');

    let serverOptions: ServerOptions = {
        run: {command: serverExe, args:['--lsp', "main.sl"], 
            transport: TransportKind.ipc},
        debug: {command: serverExe, args:['--lsp', "main.sl"], transport: TransportKind.ipc}
    };

    let clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            {
                pattern: '**/*.sl',
            }
        ]
    };

    let lspClient = new LanguageClient("simplelang", "SimpleLang LSP", serverOptions, clientOptions);

    // For debugging only
    lspClient.trace = Trace.Verbose;
    context.subscriptions.push(lspClient.start());
	console.log('Initialized simplelanguage client');
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
