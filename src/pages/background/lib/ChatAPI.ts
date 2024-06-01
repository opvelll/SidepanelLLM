import { ChatCompletion } from 'openai/resources';
import { ReceivedMessage } from '../../sidepanel/lib/MessageType';

export const fetchAIChatAPI = async (openai, model, context): Promise<ReceivedMessage> => {
  try {
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
