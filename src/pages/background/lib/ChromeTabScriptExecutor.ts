import { ReceivedMessage } from '../../sidepanel/lib/MessageType';

const executeScript = async (
  sendResponse: (message: ReceivedMessage) => void,
  func,
  funcErrorMessage: string,
  func2: (result: string, sendResponse: (message: ReceivedMessage) => void) => void,
) => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0].id) {
      sendResponse({ status: 'error', errorMessage: 'No active tab found.' });
      return;
    }
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: func,
    });
    if (result.length === 0 || !result[0].result) {
      sendResponse({ status: 'error', errorMessage: funcErrorMessage });
    } else {
      func2(result[0].result as string, sendResponse);
    }
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e : new Error('Unknown error');
    sendResponse({ status: 'error', errorMessage: error.message });
  }
};

export default executeScript;
