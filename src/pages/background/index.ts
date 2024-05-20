import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');
reloadOnUpdate('pages/sidepanel');

import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';
import OptionStorage from '@root/src/shared/storages/OptionStorage';
import { TextSelectionSender } from './lib/TextSelectionSender';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

OptionStorage.get().then(({ openAIKey }) => {
  const openai = new OpenAI({ apiKey: openAIKey });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);
    if (message.type === 'getSelectedTextRequest') {
      TextSelectionSender.sendSelectionText(sendResponse);
    } else if (message.type === 'queryChatAPI') {
      fetchAIChatAPI(openai, message.model, message.context, sendResponse);
    } else if (message.type === 'getAllPageRequest') {
      getAllPageText(sendResponse);
    }
    return true;
  });
});

const fetchAIChatAPI = async (openai, model, context, sendResponse) => {
  const chatCompletion: ChatCompletion = await openai.chat.completions.create({
    messages: context,
    model: model,
  });
  sendResponse({ status: 'success', response: chatCompletion.choices[0].message.content });
};

const getAllPageText = async sendResponse => {
  chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
    if (!tabs[0].id) return sendResponse({ status: 'error', response: '', error: 'No active tab found.' });
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: getMainText,
    });
    if (result.length === 0 || !result[0].result)
      return sendResponse({ status: 'error', response: '', error: 'No text found on the page.' });
    sendResponse({ status: 'success', response: result[0].result });
  });
};

function getMainText() {
  const mainElement = document.querySelector('main');
  return mainElement ? mainElement.innerText : '';
}

console.log('background loaded');
