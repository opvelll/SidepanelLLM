import React, { useState } from 'react';
import useStorage from '@src/shared/hooks/useStorage';
import ApiKeyStorage from '@root/src/shared/storages/ApiKeyStorage';
import OptionStorage from '@root/src/shared/storages/OptionStorage';

const Options: React.FC = () => {
  const { openAIKey, googleKey } = useStorage(ApiKeyStorage);
  const [inputValueOpenAI, setInputValueOpenAI] = useState(openAIKey);
  const [inputValueGoogle, setInputValueGoogle] = useState(googleKey);

  const defaultSystemPrompt =
    `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. cutoff: 2023-10 Current date: ` +
    new Date().toISOString().split('T')[0];

  const { systemPrompt } = useStorage(OptionStorage);
  const [inputValueSystemPrompt, setInputValueSystemPrompt] = useState(
    systemPrompt ? systemPrompt : defaultSystemPrompt,
  );

  const handleApiKeySubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ApiKeyStorage.set({ openAIKey: inputValueOpenAI, googleKey: inputValueGoogle });
  };

  const handleSystemPromptSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    OptionStorage.setSystemPrompt(inputValueSystemPrompt);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="space-y-6 bg-white p-6 shadow-md rounded-md">
        <h1 className="text-xl font-bold border-b pb-1">Option</h1>
        <div className="space-y-6 px-4">
          <h2 className="text-lg font-bold border-b pb-1">API Keys</h2>
          <div className="flex items-center">
            <label htmlFor="api-key-open" className="flex items-center  text-sm font-medium text-gray-700">
              OpenAI
            </label>
            <div className="text-sm p-1">:</div>
            <input
              id="api-key-open"
              type="password"
              value={inputValueOpenAI}
              onChange={e => setInputValueOpenAI(e.target.value)}
              className="block p-2 ml-2 border border-gray-300 rounded-md"
              placeholder="Enter your API key"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="api-key-google" className="flex items-center  text-sm font-medium text-gray-700">
              Google
            </label>
            <div className="text-sm p-1">:</div>
            <input
              id="api-key-google"
              type="password"
              value={inputValueGoogle}
              onChange={e => setInputValueGoogle(e.target.value)}
              className="block p-2 ml-2 border border-gray-300 rounded-md"
              placeholder="Enter your API key"
            />
          </div>

          <div className="flex flex-row-reverse">
            <button
              onClick={handleApiKeySubmit}
              type="submit"
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
        <div className="space-y-6 px-4">
          <h2 className="text-lg font-bold border-b pb-1">System Prompt</h2>
          <textarea
            className="block p-2 border border-gray-300 rounded-md w-11/12 h-32 "
            value={inputValueSystemPrompt}
            onChange={e => setInputValueSystemPrompt(e.target.value)}
            placeholder={defaultSystemPrompt}
          />
          <div className="flex flex-row-reverse">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700"
              onClick={handleSystemPromptSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
