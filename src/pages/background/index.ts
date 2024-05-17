import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

reloadOnUpdate('pages/sidepanel');

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
