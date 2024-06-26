import { useStorageSuspense } from '@chrome-extension-boilerplate/shared';
import { ApiKeyStorage } from '@chrome-extension-boilerplate/storage';
import { useState } from 'react';

export default function APISettingView() {
  const { openAIKey, googleKey } = useStorageSuspense(ApiKeyStorage);
  const [inputValueOpenAI, setInputValueOpenAI] = useState(openAIKey);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputValueGoogle, setInputValueGoogle] = useState(googleKey);

  const handleApiKeySubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ApiKeyStorage.set({ openAIKey: inputValueOpenAI, googleKey: inputValueGoogle });
  };

  return (
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
      {/* <div className="flex items-center">
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
      </div> */}

      <div className="flex flex-row-reverse">
        <button
          onClick={handleApiKeySubmit}
          type="submit"
          className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
}
