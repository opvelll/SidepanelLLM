import {
  withErrorBoundary,
  withSuspense,
} from '@chrome-extension-boilerplate/shared';
import { AIChatView } from 'react-ai-chat-view';
import type { AIChatResponse } from 'react-ai-chat-view';

const SidePanel = () => {
  const systemPrompt = 'hello';
  const fetchAIChatAPI = async (): Promise<AIChatResponse> => {
    return { content: 'hello', totalTokenCount: 1 };
  };

  return (
    <div>
      <AIChatView {...{ systemPrompt, fetchAIChatAPI }} />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
