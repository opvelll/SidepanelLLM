import 'webextension-polyfill';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload.");

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse): boolean => {
  if (message.type === 'getSelectedTextRequest') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0].id) {
        sendResponse({ response: 'error' });
      } else {
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: function getSelectedText() {
              const selection = window.getSelection();
              return selection ? selection.toString() : 'error';
            },
          })
          .then(result => {
            console.log('result', result);
            sendResponse({ response: result[0].result });
          })
          .catch(e => {
            console.error(e);
            sendResponse({ response: 'error' });
          });
      }
    });
    return true;
  }
  return true;
});
