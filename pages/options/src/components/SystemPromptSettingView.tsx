import { useStorageSuspense } from '@chrome-extension-boilerplate/shared';
import { cutoffAndCurrentDate, defaultSystemPrompt, SystemPromptStorage } from '@chrome-extension-boilerplate/storage';
import { useState } from 'react';

export default function SystemPromptSettingView() {
  const { isIncludeCutoffAndCurrentDate } = useStorageSuspense(SystemPromptStorage);
  const [inputValueSystemPrompt, setInputValueSystemPrompt] = useState('');
  const [isCheckIncludeCutoffAndCurrentDate, setIsCheckIncludeCutoffAndCurrentDate] =
    useState(isIncludeCutoffAndCurrentDate);
  const handleSystemPromptSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await SystemPromptStorage.setSystemPrompt(inputValueSystemPrompt);
    await SystemPromptStorage.setIncludeCutoffAndCurrentDate(isCheckIncludeCutoffAndCurrentDate);
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
      {/* チェックボタンでsystem promptにcutoff,currentdateの文を追加するかの設定 */}
      <div className="flex items-center space-x-2">
        <input
          id="includeCutoffAndCurrentDate"
          checked={isCheckIncludeCutoffAndCurrentDate}
          onChange={() => setIsCheckIncludeCutoffAndCurrentDate(!isIncludeCutoffAndCurrentDate)}
          type="checkbox"
          className="h-4 w-4"
        />
        <label htmlFor="includeCutoffAndCurrentDate">
          Include cutoff and current date {'"'} <span className="text-gray-500">{cutoffAndCurrentDate}</span> {'"'}
        </label>
      </div>
      {/* save button */}
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
