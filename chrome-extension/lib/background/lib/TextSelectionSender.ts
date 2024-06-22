import { MessageFromBackground } from '../../../../types/MessageType';
import executeScript from './ChromeTabScriptExecutor';

const sendSelectionText = async (): Promise<MessageFromBackground> => {
  return await executeScript(
    getSelectedText,
    'No Selected Text.',
    async (result: string): Promise<MessageFromBackground> => {
      return { status: 'success', response: result } as MessageFromBackground;
    },
  );
};

const getSelectedText = () => {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
};

export default sendSelectionText;
