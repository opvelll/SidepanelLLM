import React from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { AIChatView } from 'react-ai-chat-view';
import { ChatContextType } from 'react-ai-chat-view/dist/components/ChatContextType';
import useStorage from '@root/src/shared/hooks/useStorage';
import OptionStorage from '@root/src/shared/storages/OptionStorage';
import { getModelNameList } from './lib/ModelFetcher';
import { Message, isError } from './lib/MessageType';

const SidePanel = () => {
  const systemPrompt = 'hello';
  const fetchAIChatAPI = async (modelname: string, context: ChatContextType) => {
    const res = await chrome.runtime.sendMessage({ type: 'queryChatAPI', model: modelname, context: context });
    return res.response;
  };
  const handleGetSelectionButton = handleRequestButton.bind(null, 'getSelectedTextRequest');
  const handleGetSubtitlesButton = handleRequestButton.bind(null, 'getSubtitlesRequest');
  const handleGetAllPageButton = handleRequestButton.bind(null, 'getAllPageRequest');
  const modelList = getModelNameList(useStorage(OptionStorage));

  return (
    <div>
      <AIChatView
        {...{
          systemPrompt,
          fetchAIChatAPI,
          handleGetSelectionButton,
          handleGetSubtitlesButton,
          handleGetAllPageButton,
          modelName: modelList[0],
          modelList,
        }}
      />
    </div>
  );
};
const handleRequestButton = async (
  requestType: string,
  inputTextValue: string,
  setInputTextValue: (value: string) => void,
) => {
  const res: Message = await chrome.runtime.sendMessage({ type: requestType });
  if (isError(res)) return;
  setInputTextValue(formatResponse(inputTextValue, res));
};

const formatResponse = (inputTextValue: string, res: Message) => inputTextValue + '\n```\n' + res.response + '\n```\n';

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
