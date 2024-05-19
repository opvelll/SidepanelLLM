import React from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { AIChatView } from 'react-ai-chat-view';
import { ChatContextType } from 'react-ai-chat-view/dist/components/ChatContextType';
import useStorage from '@root/src/shared/hooks/useStorage';
import OptionStorage from '@root/src/shared/storages/OptionStorage';
import { getModelList } from './lib/ModelFetcher';

const SidePanel = () => {
  const systemPrompt = 'hello';
  const fetchAIChatAPI = async (modelname: string, context: ChatContextType) => {
    const res = await chrome.runtime.sendMessage({ type: 'queryChatAPI', model: modelname, context: context });
    return res.response;
  };
  const handleGetSelectionButton = async (inputTextValue: string, setInputTextValue: (value: string) => void) => {
    console.log('handleGetSelectionButton');
    const res = await chrome.runtime.sendMessage({ type: 'getSelectedTextRequest' });
    setInputTextValue('```\n' + res.response + '\n```\n');
  };

  const { openAIKey, googleKey } = useStorage(OptionStorage);

  const modelList = getModelList({ openAIKey, googleKey });

  return (
    <div>
      <AIChatView {...{ systemPrompt, fetchAIChatAPI, handleGetSelectionButton, modelName: modelList[0], modelList }} />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
