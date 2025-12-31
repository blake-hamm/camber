import * as vscode from 'vscode';
import { CamberPanel } from './panels/CamberPanel';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('camber.start', () => {
			CamberPanel.createOrShow(context.extensionUri);
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(CamberPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: unknown) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = {
					// Enable javascript in the webview
					enableScripts: true,
					// And restrict the webview to only loading content from our extension's `media` directory.
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
				};
				CamberPanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}
}

