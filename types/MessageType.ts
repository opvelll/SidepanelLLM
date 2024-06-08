export type ReceivedMessage = SuccessMessage | ErrorMessage | CautionMessage;

export type SuccessMessage = {
  status: 'success';
} & ResponseMessage;

export type ErrorMessage = {
  status: 'error';
  errorMessage: string;
};

export type CautionMessage = {
  status: 'caution';
  caution: string;
} & ResponseMessage;

export type Status = 'success' | 'error' | 'caution';
export type ResponseMessage = {
  response: string;
  image_url?: string;
  completion_tokens?: number;
  total_tokens?: number;
};

export type GetTextRequest = 'getSelectedTextRequest' | 'getSubtitlesRequest' | 'getAllPageRequest' | 'getScreenshot';

export type SentMessage = {
  type: GetTextRequest;
};
