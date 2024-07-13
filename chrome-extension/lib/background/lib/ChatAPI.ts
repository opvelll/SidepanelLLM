import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';
import { ChatResponse } from '../../../../pages/sidepanel/src/types/MessageType';
import { ApiKeyStorage } from '@chrome-extension-boilerplate/storage';
import OpenAI from 'openai';

export const fetchAIChatAPI = async (model: string, context: ChatCompletionMessageParam[]): Promise<ChatResponse> => {
  try {
    // 毎度、APIキーを取得して、new OpenAI() で初期化している
    const { openAIKey } = await ApiKeyStorage.get();
    if (!openAIKey) {
      return { status: 'error', errorMessage: 'OpenAI API key is not set' };
    }
    const openai = new OpenAI({ apiKey: openAIKey });

    const chatCompletion: ChatCompletion = await openai.chat.completions.create({
      messages: context,
      model: model,
    });
    return {
      status: 'success',
      response: chatCompletion.choices[0].message.content || '',
      completion_tokens: chatCompletion.usage ? chatCompletion.usage.completion_tokens : 0,
      total_tokens: chatCompletion.usage ? chatCompletion.usage.total_tokens : 0,
    };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e : new Error('Unknown error');
    return { status: 'error', errorMessage: error.message };
  }
};
