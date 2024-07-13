import { ChatCompletionMessageParam } from 'openai/resources';

export type MessageToBackground =
  | {
      type: 'queryChatAPI';
      model: string;
      context: ChatCompletionMessageParam[];
    }
  | {
      type: GetTextRequestType;
    };

export type GetTextRequestType =
  | 'getSelectedTextRequest'
  | 'getSubtitlesRequest'
  | 'getAllPageRequest'
  | 'getScreenshot';

export type ChatResponse =
  | {
      status: 'success';
      response: string;
      completion_tokens: number;
      total_tokens: number;
    }
  | {
      status: 'error';
      errorMessage: string;
    };

export type MessageFromBackground = BackgroundSuccessMessage | BackgroundErrorMessage | BackgroundCautionMessage;

export type BackgroundSuccessMessage = {
  status: 'success';
} & BackgroundResponseMessage;

export type BackgroundErrorMessage = {
  status: 'error';
  errorMessage: string;
};

export type BackgroundCautionMessage = {
  status: 'caution';
  cautionMessage: string;
} & BackgroundResponseMessage;

export type Status = 'success' | 'error' | 'caution';
export type BackgroundResponseMessage = {
  response: string;
  image_url?: string;
};
