export type Status = 'success' | 'error' | 'caution';
export type ResponseMessage = { response: string };

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

export type ReceivedMessage = SuccessMessage | ErrorMessage | CautionMessage;

export type GetTextRequest = 'getSelectedTextRequest' | 'getSubtitlesRequest' | 'getAllPageRequest';

export type SentMessage = {
  type: GetTextRequest;
};
