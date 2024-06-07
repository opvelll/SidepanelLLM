export type SystemPrompt = { systemPrompt: string; isIncludeCutoffAndCurrentDate: boolean };

export const defaultSystemPrompt = `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.`;

export const cutoffAndCurrentDate = `cutoff: 2023-10 Current date: ` + new Date().toISOString().split('T')[0];

export const createPrompt = ({ systemPrompt, isIncludeCutoffAndCurrentDate }: SystemPrompt) =>
  (systemPrompt || defaultSystemPrompt) + (isIncludeCutoffAndCurrentDate ? '\n' + cutoffAndCurrentDate : '');
