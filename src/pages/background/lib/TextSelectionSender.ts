import { ReceivedMessage } from '../../sidepanel/lib/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const sendSelectionText = async (): Promise<ReceivedMessage> => {
  return await executeScript(getSelectedText, 'No Selected Text.', async (result: string): Promise<ReceivedMessage> => {
    return { status: 'success', response: result } as ReceivedMessage;
  });
};

const getSelectedText = () => window.getSelection().toString();

export default sendSelectionText;
