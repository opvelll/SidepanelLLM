import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');
reloadOnUpdate('pages/sidepanel');

import OpenAI from 'openai';

import ApiKeyStorage from '@root/src/shared/storages/ApiKeyStorage';
import getYoutubeSubtitles from './lib/YoutubeSubtitleFetcher';
import getAllPageText from './lib/WebPageTextExtractor';
import sendSelectionText from './lib/TextSelectionSender';

import { captureVisibleTab } from './lib/Capture';
import { fetchAIChatAPI } from './lib/ChatAPI';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

const handleMessages = async () => {
  const { openAIKey } = await ApiKeyStorage.get();
  const openai = new OpenAI({ apiKey: openAIKey });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);
    if (message.type === 'getSelectedTextRequest') {
      sendSelectionText().then(result => sendResponse(result));
    } else if (message.type === 'queryChatAPI') {
      fetchAIChatAPI(openai, message.model, message.context).then(result => sendResponse(result));
    } else if (message.type === 'getAllPageRequest') {
      getAllPageText().then(result => sendResponse(result));
    } else if (message.type === 'getSubtitlesRequest') {
      getYoutubeSubtitles().then(result => sendResponse(result));
    } else if (message.type === 'getScreenshot') {
      captureVisibleTab(sendResponse);
    }
    return true;
  });
};

handleMessages();

console.log('background loaded');
