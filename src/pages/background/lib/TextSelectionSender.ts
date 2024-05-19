export class TextSelectionSender {
  static sendSelectionText(sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      try {
        const result = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: function getSelectedText() {
            return window.getSelection().toString();
          },
        });
        console.log('result', result);
        if (result.length === 0 || !result[0].result)
          sendResponse({ status: 'error', response: '', error: 'No text selected.' });
        sendResponse({ status: 'success', response: result[0].result });
      } catch (e) {
        console.error(e);
        sendResponse({ status: 'error', response: '', error: e });
        throw e;
      }
    });
  }
}
