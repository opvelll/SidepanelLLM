import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';
import OptionStorage from '@root/src/shared/storages/OptionStorage';

console.log('background loaded');

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

reloadOnUpdate('pages/sidepanel');
let openai: OpenAI;
OptionStorage.get().then(({ openAIKey, googleKey }) => {
  openai = new OpenAI({
    apiKey: openAIKey,
  });
  console.log(openAIKey, googleKey);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);
    if (message.type === 'getSelectedTextRequest') {
      console.log('getSelectedTextRequest');
      sendSelectionText(sendResponse);
      return true;
    } else if (message.type === 'queryChatAPI') {
      fetchAIChatAPI(message.model, message.context, sendResponse);
      return true;
    }
    return true;
  });
});

const fetchAIChatAPI = async (model, context, sendResponse) => {
  const chatCompletion: ChatCompletion = await openai.chat.completions.create({
    messages: context,
    model: model,
  });
  sendResponse({ response: chatCompletion.choices[0].message.content });
};

const sendSelectionText = sendResponse => {
  chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
    try {
      const result = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: function getSelectedText() {
          return window.getSelection().toString();
        },
      });
      sendResponse({ response: result[0].result });
    } catch (e) {
      console.error(e);
      sendResponse({ response: 'error' });
    }
  });
};
