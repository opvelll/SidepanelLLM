import { MessageFromBackground } from '../../../../types/MessageType';

export const captureVisibleTab = (sendResponse: (response: MessageFromBackground) => void) => {
  chrome.tabs.captureVisibleTab({ format: 'png' }, image => {
    if (!image) {
      sendResponse({ status: 'error', errorMessage: 'Failed to capture image' } as MessageFromBackground);
      return;
    }
    sendResponse({ status: 'success', response: '', image_url: image } as MessageFromBackground);
  });
};
