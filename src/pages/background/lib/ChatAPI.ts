import { ChatCompletion } from 'openai/resources';
import { ReceivedMessage } from '../../sidepanel/lib/MessageType';
import ApiKeyStorage from '@root/src/shared/storages/ApiKeyStorage';
import OpenAI from 'openai';

export const fetchAIChatAPI = async (model, context): Promise<ReceivedMessage> => {
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
      response: chatCompletion.choices[0].message.content,
      completion_tokens: chatCompletion.usage.completion_tokens,
      total_tokens: chatCompletion.usage.total_tokens,
    };
  } catch (e) {
    console.error(e);
    return { status: 'error', errorMessage: e.message };
  }
};
