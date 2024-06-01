import { ReceivedMessage } from '../../sidepanel/lib/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const getAllPageText = async (): Promise<ReceivedMessage> => {
  return await executeScript(getMainText, 'ページから文章を取り出せませんでした。', async result => {
    return { status: 'success', response: result } as ReceivedMessage;
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
