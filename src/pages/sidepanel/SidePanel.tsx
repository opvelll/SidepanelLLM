import React from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { AIChatView } from 'react-ai-chat-view';

const SidePanel = () => {
  const systemPrompt = 'hello';
  const fetchAIChatAPI = async () => {
    return 'hello';
  };
  const handleGetSelectionButton = async (inputTextValue: string, setInputTextValue: (value: string) => void) => {
    const res = await chrome.runtime.sendMessage({ type: 'getSelectedTextRequest' });
    setInputTextValue('```\n' + res.response + '\n```\n');
  };

  return (
    <div>
      <AIChatView {...{ systemPrompt, fetchAIChatAPI, handleGetSelectionButton }} />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
