import {
  useStorageSuspense,
  withErrorBoundary,
  withSuspense,
} from '@chrome-extension-boilerplate/shared';
import { SystemPromptStorage, SideButtonSettingStorage, SideButtonData, createPrompt } from '@chrome-extension-boilerplate/storage';
import { AIChatView } from 'react-ai-chat-view';
import type { AIChatResponse, AIModelData, ChatContextType, ChatFormButtonData, SideButtonFuncResponse } from 'react-ai-chat-view';
import { CautionMessage, GetTextRequest, ReceivedMessage, SuccessMessage } from './lib/MessageType';
import { MdOutlineSubtitles, MdScreenshotMonitor } from 'react-icons/md';
import { SiPagekit } from 'react-icons/si';
import { FaRegCopy } from 'react-icons/fa';

const SidePanel = () => {
  const systemPrompt = useStorageSuspense(SystemPromptStorage);
  const sideButtonList = useStorageSuspense(SideButtonSettingStorage);

  const fetchAIChatAPI = async (modelData: AIModelData, context: ChatContextType): Promise<AIChatResponse> => {
    const res: ReceivedMessage = await chrome.runtime.sendMessage({
      type: 'queryChatAPI',
      model: modelData.modelName,
      context: context,
    });
    if (res.status === 'error') throw new Error(res.errorMessage);
    return {
      content: res.response,
      tokenCount: res.completion_tokens,
      totalTokenCount: res.total_tokens || 0,
    };
  };

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
    return sideButtonDataList.map(sideButtonData => {
      return {
        title: sideButtonData.additionalPrompts,
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
          systemPrompt: createPrompt(systemPrompt),
          fetchAIChatAPI,
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

  if (import.meta.env.VITE_ENV === 'development') console.log('response sidepanel', res);

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
