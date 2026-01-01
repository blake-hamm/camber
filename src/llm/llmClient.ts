import * as vscode from 'vscode';
import { ConfigService } from '../utils/config';

export const createLLMClient = async (context: vscode.ExtensionContext) => {
  const { AxAIOpenAI } = await import('@ax-llm/ax');
  type AxOptions = ConstructorParameters<typeof AxAIOpenAI>[0];

  const configService = new ConfigService(context);
  const apiKey = await configService.getApiKey();

  if (!apiKey) {
    return undefined;
  }

  const endpoint = await configService.getEndpoint();
  const model = await configService.getModel();

  const options: AxOptions = {
    apiKey,
    ...(endpoint && { baseURL: endpoint }),
    ...(model && { model }),
  };

  const llm = new AxAIOpenAI(options);

  return llm;
};

export type LLMClient = Awaited<ReturnType<typeof createLLMClient>>;
