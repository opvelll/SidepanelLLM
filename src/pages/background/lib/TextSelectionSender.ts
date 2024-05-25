import executeScript from './ChromeTabScriptExecutor';

const sendSelectionText = sendResponse => {
  executeScript(sendResponse, getSelectedText, 'No Selected Text.', (result, sendResponse) => {
    sendResponse({ status: 'success', response: result });
  });
};

const getSelectedText = () => window.getSelection().toString();

export default sendSelectionText;
