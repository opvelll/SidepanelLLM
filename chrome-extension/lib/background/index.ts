import 'webextension-polyfill';
import getYoutubeSubtitles from './lib/YoutubeSubtitleFetcher';
import getAllPageText from './lib/WebPageTextExtractor';
import sendSelectionText from './lib/TextSelectionSender';
import { captureVisibleTab } from './lib/Capture';
import { fetchAIChatAPI } from './lib/ChatAPI';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //if (import.meta.env.MODE === 'development') console.log('message', message);

  if (message.type === 'getSelectedTextRequest') {
    sendSelectionText().then(result => sendResponse(result));
  } else if (message.type === 'queryChatAPI') {
    fetchAIChatAPI(message.model, message.context).then(result => sendResponse(result));
  } else if (message.type === 'getAllPageRequest') {
    getAllPageText().then(result => sendResponse(result));
  } else if (message.type === 'getSubtitlesRequest') {
    getYoutubeSubtitles().then(result => sendResponse(result));
  } else if (message.type === 'getScreenshot') {
    captureVisibleTab(sendResponse);
  }
  return true;
});

console.log('background loaded');
