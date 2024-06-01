import React from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { AIChatView } from 'react-ai-chat-view';
import useStorage from '@root/src/shared/hooks/useStorage';
import ApiKeyStorage from '@root/src/shared/storages/ApiKeyStorage';
import { getActiveModelList } from './lib/ModelFetcher';
import { CautionMessage, GetTextRequest, ReceivedMessage, SuccessMessage } from './lib/MessageType';
import { MdOutlineSubtitles, MdScreenshotMonitor } from 'react-icons/md';
import { SiPagekit } from 'react-icons/si';
import { FaRegCopy } from 'react-icons/fa';
import {
  ChatFormButtonData,
  SideButtonFuncResponse,
} from 'react-ai-chat-view/dist/components/ChatView/ChatForm/ChatFormSideButton';
import { ChatContextType } from 'react-ai-chat-view/dist/components/ChatView/Type/ChatContextType';
import defaultSystemPrompt from '@root/src/shared/storages/Prompt';
import SideButtonSettingStorage, { SideButtonData } from '@root/src/shared/storages/SideButtonSettingStorage';
import SystemPromptStorage from '@root/src/shared/storages/SystemPromptStorage';
import { AIChatResponse } from 'react-ai-chat-view/dist/components/ChatView/Type/AIChatAPIType';

const SidePanel = () => {
  const systemPrompt = useStorage(SystemPromptStorage);
  const sideButtonList = useStorage(SideButtonSettingStorage);
  const fetchAIChatAPI = async (modelname: string, context: ChatContextType): Promise<AIChatResponse> => {
    const res: ReceivedMessage = await chrome.runtime.sendMessage({
      type: 'queryChatAPI',
      model: modelname,
      context: context,
    });
    if (res.status === 'error') throw new Error(res.errorMessage);
    return {
      content: res.response,
      tokenCount: res.completion_tokens,
      totalTokenCount: res.total_tokens,
    };
  };

  const modelList = getActiveModelList(useStorage(ApiKeyStorage));

  const topButtonDataList: ChatFormButtonData[] = [
    {
      title: 'get selection',
      icon: <FaRegCopy />,
      func: handleRequestButton.bind(null, 'getSelectedTextRequest', 'Extracts from the website:'),
      color: 'text-orange-300',
    },
    {
      title: 'subtitles',
      icon: <MdOutlineSubtitles />,
      func: handleRequestButton.bind(null, 'getSubtitlesRequest', 'Subtitling information on youtube:'),
      color: 'text-red-400',
    },
    {
      title: 'all page',
      icon: <SiPagekit />,
      func: handleRequestButton.bind(null, 'getAllPageRequest', 'All sentences on page:'),
      color: 'text-gray-500',
    },
    {
      title: 'screen shot',
      icon: <MdScreenshotMonitor />,
      func: handleRequestButton.bind(null, 'getScreenshot', ''),
    },
  ];

  const sideButtonDataToButtonDataList = (sideButtonDataList: SideButtonData[]) => {
    //console.log('sideButtonDataList', sideButtonDataList);
    return sideButtonDataList.map(sideButtonData => {
      return {
        title: sideButtonData.displayText,
        icon: <div>{sideButtonData.displayText}</div>,
        func: async (inputTextValue: string) => {
          return { newText: inputTextValue + '\n' + sideButtonData.additionalPrompts + '\n' };
        },
        color: 'text-blue-300',
      };
    });
  };

  return (
    <div>
      <AIChatView
        {...{
          systemPrompt: systemPrompt ? systemPrompt : defaultSystemPrompt,
          fetchAIChatAPI,
          modelList,
          topButtonDataList,
          bottomButtonDataList: sideButtonDataToButtonDataList(sideButtonList),
        }}
      />
    </div>
  );
};

const handleRequestButton = async (
  requestType: GetTextRequest,
  formatString: string,
  inputTextValue: string,
  images: string[],
  showCaution: (value: string) => void,
): Promise<SideButtonFuncResponse> => {
  const res: ReceivedMessage = await chrome.runtime.sendMessage({ type: requestType });
  console.log('response sidepanel', res);
  switch (res.status) {
    case 'error':
      throw new Error(res.errorMessage);
    case 'caution':
      showCaution(res.caution);
      return createReturnType(inputTextValue, images, formatString, res);
    case 'success':
      return createReturnType(inputTextValue, images, formatString, res);
  }
};

const createReturnType = (
  inputTextValue: string,
  images: string[],
  formatString: string,
  res: SuccessMessage | CautionMessage,
): SideButtonFuncResponse => {
  const newText = res.response ? formatResponse(inputTextValue, formatString, res.response) : inputTextValue;
  const newImages = res.image_url ? [...images, res.image_url] : images;
  return { newText, newImages };
};

const formatResponse = (inputTextValue: string, formatString: string, response: string) =>
  inputTextValue + '\n' + formatString + '\n```\n' + response + '\n```\n\n';

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
