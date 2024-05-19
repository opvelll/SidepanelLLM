// modelFetcher.ts

import { APIKeySettings } from '@root/src/shared/storages/OptionStorage';

export type Model = {
  corporation: string;
  modelName: string;
};

const allModelList: Model[] = [
  { corporation: 'OpenAI', modelName: 'gpt-3.5-turbo' },
  { corporation: 'OpenAI', modelName: 'gpt-4.0-turbo' },
  { corporation: 'Google', modelName: 'gemini-pro-vision' },
];

export const getModelList = (keys: APIKeySettings): string[] => {
  const activeCorporations = Object.entries(keys)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([key, value]) => value)
    .map(([key]) => {
      switch (key) {
        case 'openAIKey':
          return 'OpenAI';
        case 'googleKey':
          return 'Google';
      }
    }) as string[];

  return allModelList.filter(model => activeCorporations.includes(model.corporation)).map(model => model.modelName);
};
