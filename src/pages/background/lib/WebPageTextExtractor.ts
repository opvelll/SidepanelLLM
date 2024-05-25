import { ReceivedMessage } from '../../sidepanel/lib/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const getAllPageText = (sendResponse: (message: ReceivedMessage) => void) => {
  executeScript(sendResponse, getMainText, 'ページから文章を取り出せませんでした。', (result, sendResponse) => {
    sendResponse({ status: 'success', response: result });
  });
};

const getMainText = () => {
  const mainElement = document.querySelector('main');
  const bodyElement = document.querySelector('body');
  if (!mainElement && !bodyElement) {
    return '';
  } else if (mainElement) {
    return mainElement.textContent;
  } else if (bodyElement) {
    return bodyElement.textContent;
  }
};

export default getAllPageText;
