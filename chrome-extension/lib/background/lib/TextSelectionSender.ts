import { ReceivedMessage } from '../../../../types/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const sendSelectionText = async (): Promise<ReceivedMessage> => {
  return await executeScript(getSelectedText, 'No Selected Text.', async (result: string): Promise<ReceivedMessage> => {
    return { status: 'success', response: result } as ReceivedMessage;
  });
};

const getSelectedText = () => {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
};

export default sendSelectionText;
