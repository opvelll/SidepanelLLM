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
import { ReceivedMessage } from '../sidepanel/lib/MessageType';

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
      try {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, image => {
          console.log('image', image);
          if (!image) throw new Error('Failed to capture screenshot');
          sendResponse({ status: 'success', response: '', image_url: image });
        });
      } catch (e) {
        console.error(e);
        sendResponse({ status: 'error', errorMessage: e.message });
      }
    }
    return true; // keep the message channel open until sendResponse is called
  });
};

handleMessages();

const fetchAIChatAPI = async (openai, model, context): Promise<ReceivedMessage> => {
  try {
    const chatCompletion: ChatCompletion = await openai.chat.completions.create({
      messages: context,
      model: model,
    });
    return {
      status: 'success',
      response: chatCompletion.choices[0].message.content,
      completion_tokens: chatCompletion.usage.completion_tokens,
      total_tokens: chatCompletion.usage.total_tokens,
    };
  } catch (e) {
    console.error(e);
    return { status: 'error', errorMessage: e.message };
  }
};

console.log('background loaded');
