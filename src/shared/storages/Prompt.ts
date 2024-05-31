const defaultSystemPrompt =
  `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. cutoff: 2023-10 Current date: ` +
  new Date().toISOString().split('T')[0];

export default defaultSystemPrompt;
