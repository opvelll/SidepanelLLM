import 'webextension-polyfill';
import getYoutubeSubtitles from './lib/YoutubeSubtitleFetcher';
import getAllPageText from './lib/WebPageTextExtractor';
import sendSelectionText from './lib/TextSelectionSender';
import { captureVisibleTab } from './lib/Capture';
import { fetchAIChatAPI } from './lib/ChatAPI';
import { MessageToBackground } from '../../../pages/sidepanel/src/types/MessageType';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

chrome.runtime.onMessage.addListener((message: MessageToBackground, sender, sendResponse) => {
  if (import.meta.env.MODE === 'development') console.log('message', message);

  switch (message.type) {
    case 'queryChatAPI':
      fetchAIChatAPI(message.model, message.context).then(result => sendResponse(result));
      break;
    case 'getSelectedTextRequest':
      sendSelectionText().then(result => sendResponse(result));
      break;
    case 'getAllPageRequest':
      getAllPageText().then(result => sendResponse(result));
      break;
    case 'getSubtitlesRequest':
      getYoutubeSubtitles().then(result => sendResponse(result));
      break;
    case 'getScreenshot':
      captureVisibleTab(sendResponse);
      break;
  }
  return true;
});

console.log('background loaded');
