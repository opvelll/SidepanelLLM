import { ReceivedMessage } from '../../sidepanel/lib/MessageType';

export const captureVisibleTab = (sendResponse: (response: ReceivedMessage) => void) => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, image => {
    if (!image) {
      sendResponse({ status: 'error', errorMessage: 'Failed to capture image' } as ReceivedMessage);
      return;
    }
    sendResponse({ status: 'success', response: '', image_url: image } as ReceivedMessage);
  });
};
