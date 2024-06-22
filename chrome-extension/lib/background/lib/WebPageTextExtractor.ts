import { MessageFromBackground } from '../../../../types/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const getAllPageText = async (): Promise<MessageFromBackground> => {
  return await executeScript(getMainText, 'ページから文章を取り出せませんでした。', async result => {
    return { status: 'success', response: result } as MessageFromBackground;
  });
};

const getMainText = () => {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement.textContent || '';
  }

  const bodyElement = document.querySelector('body');
  if (bodyElement) {
    const clonedBody = bodyElement.cloneNode(true) as HTMLElement;
    const scriptElements = clonedBody.querySelectorAll('script');
    scriptElements.forEach(script => script.remove());
    return clonedBody.textContent || '';
  }
  return '';
};

export default getAllPageText;
