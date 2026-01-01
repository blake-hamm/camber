import * as vscode from 'vscode';
import { CamberPanel } from './panels/CamberPanel';
import { ConfigService } from './utils/config';

export function activate(context: vscode.ExtensionContext) {
	const configService = new ConfigService(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('camber.start', () => {
			CamberPanel.create(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('camber.updateSettings', async () => {
			const endpoint = await vscode.window.showInputBox({
				prompt: 'Enter the API endpoint',
				value: configService.getEndpoint(),
			});
			const model = await vscode.window.showInputBox({
				prompt: 'Enter the model name',
				value: configService.getModel(),
			});
			const apiKey = await vscode.window.showInputBox({
				prompt: 'Enter your API key',
				password: true,
				value: await configService.getApiKey(),
			});

			if (endpoint && model && apiKey) {
				await configService.saveSettings(endpoint, model, apiKey);
				vscode.window.showInformationMessage('Camber settings saved successfully.');
			}
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

