import { MdOutlineSubtitles, MdScreenshotMonitor } from 'react-icons/md';
import { SiPagekit } from 'react-icons/si';
import { FaRegCopy } from 'react-icons/fa';

import type { ChatFormButtonData, SideButtonFuncResponse } from 'react-ai-chat-view';
import { BackgroundSuccessMessage, BackgroundCautionMessage, MessageFromBackground, GetTextRequestType } from './types/MessageType';

export const topButtonDataList: ChatFormButtonData[] = [
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

async function handleRequestButton(
  requestType: GetTextRequestType,
  formatString: string,
  inputTextValue: string,
  images: string[],
  showCaution: (value: string) => void,
): Promise<SideButtonFuncResponse> {
  const res: MessageFromBackground = await chrome.runtime.sendMessage({ type: requestType });

  if (import.meta.env.VITE_ENV === 'development') console.log('response sidepanel', res);

  switch (res.status) {
    case 'error':
      throw new Error(res.errorMessage);
    case 'caution':
      showCaution(res.cautionMessage);
      return createReturnType(inputTextValue, images, formatString, res);
    case 'success':
      return createReturnType(inputTextValue, images, formatString, res);
  }
};

const createReturnType = (
  inputTextValue: string,
  images: string[],
  formatString: string,
  res: BackgroundSuccessMessage | BackgroundCautionMessage,
): SideButtonFuncResponse => {
  const newText = res.response ? formatResponse(inputTextValue, formatString, res.response) : inputTextValue;
  const newImages = res.image_url ? [...images, res.image_url] : images;
  return { newText, newImages };
};

const formatResponse = (inputTextValue: string, formatString: string, response: string) =>
  inputTextValue + '\n' + formatString + '\n```\n' + response + '\n```\n\n';
