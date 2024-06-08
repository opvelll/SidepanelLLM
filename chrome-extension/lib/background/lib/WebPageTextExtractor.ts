import { ReceivedMessage } from '../../../../types/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const getAllPageText = async (): Promise<ReceivedMessage> => {
  return await executeScript(getMainText, 'ページから文章を取り出せませんでした。', async result => {
    return { status: 'success', response: result } as ReceivedMessage;
  });
};

const getMainText = () => {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement.textContent || '';
  }

  const bodyElement = document.querySelector('body');
  if (bodyElement) {
    return bodyElement.textContent || '';
  }

  return '';
};

export default getAllPageText;
