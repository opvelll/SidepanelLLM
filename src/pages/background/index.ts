import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');
reloadOnUpdate('pages/sidepanel');

import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';
import ApiKeyStorage from '@root/src/shared/storages/ApiKeyStorage';
import getYoutubeSubtitles from './lib/YoutubeSubtitleFetcher';
import getAllPageText from './lib/WebPageTextExtractor';
import sendSelectionText from './lib/TextSelectionSender';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

ApiKeyStorage.get().then(({ openAIKey }) => {
  const openai = new OpenAI({ apiKey: openAIKey });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);
    if (message.type === 'getSelectedTextRequest') {
      sendSelectionText(sendResponse);
    } else if (message.type === 'queryChatAPI') {
      fetchAIChatAPI(openai, message.model, message.context, sendResponse);
    } else if (message.type === 'getAllPageRequest') {
      getAllPageText(sendResponse);
    } else if (message.type === 'getSubtitlesRequest') {
      getYoutubeSubtitles(sendResponse);
    }
    return true;
  });
});

const fetchAIChatAPI = async (openai, model, context, sendResponse) => {
  try {
    const chatCompletion: ChatCompletion = await openai.chat.completions.create({
      messages: context,
      model: model,
    });
    sendResponse({ status: 'success', response: chatCompletion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    sendResponse({ status: 'error', errorMessage: e.message });
  }
};

console.log('background loaded');
