import * as vscode from 'vscode';

const ENDPOINT_KEY = 'camber.llm.endpoint';
const MODEL_KEY = 'camber.llm.model';
const API_KEY_SECRET = 'camber.llm.apiKey';

export class ConfigService {
  constructor(private context: vscode.ExtensionContext) {}

  // Endpoint methods
  setEndpoint(endpoint: string): Thenable<void> {
    return this.context.globalState.update(ENDPOINT_KEY, endpoint);
  }

  getEndpoint(): string | undefined {
    return this.context.globalState.get(ENDPOINT_KEY);
  }

  // Model methods
  setModel(model: string): Thenable<void> {
    return this.context.globalState.update(MODEL_KEY, model);
  }

  getModel(): string | undefined {
    return this.context.globalState.get(MODEL_KEY);
  }

  // API Key methods
  async setApiKey(key: string): Promise<void> {
    return await this.context.secrets.store(API_KEY_SECRET, key);
  }

  async getApiKey(): Promise<string | undefined> {
    return await this.context.secrets.get(API_KEY_SECRET);
  }

  async saveSettings(endpoint: string, model: string, apiKey: string): Promise<void> {
    await this.setEndpoint(endpoint);
    await this.setModel(model);
    await this.setApiKey(apiKey);
  }
}
