import { ReceivedMessage } from '../../../../types/MessageType';

const executeScript = async <t>(
  func: () => t,
  funcErrorMessage: string,
  func2: (result: t) => Promise<ReceivedMessage>,
): Promise<ReceivedMessage> => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0].id) {
      return { status: 'error', errorMessage: 'No active tab found.' };
    }
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: func,
    });
    if (result.length === 0 || !result[0].result) {
      return { status: 'error', errorMessage: funcErrorMessage };
    } else {
      return await func2(result[0].result as t);
    }
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e : new Error('Unknown error');
    return { status: 'error', errorMessage: error.message };
  }
};

export default executeScript;
