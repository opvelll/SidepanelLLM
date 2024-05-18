import 'webextension-polyfill';

console.log('background loaded');
console.log("Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload.");

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'getSelectedTextRequest') {
    console.log('getSelectedTextRequest');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('tabs', tabs);
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          func: function getSelectedText() {
            console.log('window', window);
            console.log(window.getSelection().toString());
            return window.getSelection().toString();
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
    });
    return true;
  }
});
