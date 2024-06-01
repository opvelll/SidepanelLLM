import { ReceivedMessage } from '../../sidepanel/lib/MessageType';

export const captureVisibleTab = (sendResponse: (response: ReceivedMessage) => void) => {
  try {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, image => {
      console.log('image', image);
      if (!image) throw new Error('Failed to capture screenshot');
      sendResponse({ status: 'success', response: '', image_url: image } as ReceivedMessage);
    });
  } catch (e) {
    console.error(e);
    sendResponse({ status: 'error', errorMessage: e.message } as ReceivedMessage);
  }
};
