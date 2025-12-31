import * as vscode from 'vscode';

export function getWebviewOptions(
	exensionUri: vscode.Uri
): vscode.WebviewOptions & vscode.WebviewPanelOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(exensionUri, 'media')],

		// Retain the context of the webview when it's hidden
		retainContextWhenHidden: true,

		// Enable persistence
		enableCommandUris: true
	};
}

