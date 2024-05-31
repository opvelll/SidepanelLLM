import useStorage from '@root/src/shared/hooks/useStorage';
import defaultSystemPrompt from '@root/src/shared/storages/Prompt';
import SystemPromptStorage from '@root/src/shared/storages/SystemPromptStorage';
import { useState } from 'react';

export default function SystemPromptSettingView() {
  const systemPrompt = useStorage(SystemPromptStorage);
  const [inputValueSystemPrompt, setInputValueSystemPrompt] = useState(
    systemPrompt ? systemPrompt : defaultSystemPrompt,
  );

  const handleSystemPromptSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    SystemPromptStorage.setSystemPrompt(inputValueSystemPrompt);
  };

  return (
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
  );
}
