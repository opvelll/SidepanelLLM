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

console.log('background loaded');
