import React from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { AIChatView } from 'react-ai-chat-view';
import { ChatContextType } from 'react-ai-chat-view/dist/components/ChatContextType';
import useStorage from '@root/src/shared/hooks/useStorage';
import ApiKeyStorage from '@root/src/shared/storages/ApiKeyStorage';
import { getActiveModelNames } from './lib/ModelFetcher';
import { GetTextRequest, ReceivedMessage, ResponseMessage } from './lib/MessageType';
import { MdOutlineSubtitles } from 'react-icons/md';
import { SiPagekit } from 'react-icons/si';
import { FaRegCopy } from 'react-icons/fa';
import { ChatFormButtonData } from 'react-ai-chat-view/dist/components/ChatForm/ChatFormSideButton';

const SidePanel = () => {
  const systemPrompt = 'hello';
  const fetchAIChatAPI = async (modelname: string, context: ChatContextType) => {
    const res = await chrome.runtime.sendMessage({ type: 'queryChatAPI', model: modelname, context: context });
    return res.response;
  };

  const modelList = getActiveModelNames(useStorage(ApiKeyStorage));

  const topButtonDataList: ChatFormButtonData[] = [
    {
      title: 'get selection',
      icon: <FaRegCopy />,
      func: handleRequestButton.bind(null, 'getSelectedTextRequest', 'Selected Text:'),
      color: 'text-orange-300',
    },
    {
      title: 'subtitles',
      icon: <MdOutlineSubtitles />,
      func: handleRequestButton.bind(null, 'getSubtitlesRequest', 'Subtitles:'),
      color: 'text-red-400',
    },
    {
      title: 'all page',
      icon: <SiPagekit />,
      func: handleRequestButton.bind(null, 'getAllPageRequest', 'All Page Text:'),
      color: 'text-gray-500',
    },
  ];

  return (
    <div>
      <AIChatView
        {...{
          systemPrompt,
          fetchAIChatAPI,
          modelList,
          topButtonDataList,
        }}
      />
    </div>
  );
};

const handleRequestButton = async (
  requestType: GetTextRequest,
  formatString: string,
  inputTextValue: string,
  showCaution: (value: string) => void,
) => {
  const res: ReceivedMessage = await chrome.runtime.sendMessage({ type: requestType });
  console.log('response', res);
  switch (res.status) {
    case 'error':
      throw new Error(res.errorMessage);
    case 'caution':
      showCaution(res.caution);
      return formatResponse(inputTextValue, formatString, res);
    case 'success':
      return formatResponse(inputTextValue, formatString, res);
  }
};

const formatResponse = (inputTextValue: string, formatString: string, res: ResponseMessage) =>
  inputTextValue + '\n' + formatString + '\n```\n' + res.response + '\n```\n';

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
