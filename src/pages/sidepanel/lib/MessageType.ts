export type Status = 'success' | 'error';

export type Message = {
  status: Status;
  type: string;
  response: string;
  error: string;
};

export const isError = (message: Message) => message.status === 'error';
