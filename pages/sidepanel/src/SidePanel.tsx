import {
  useStorageSuspense,
  withErrorBoundary,
  withSuspense,
} from '@chrome-extension-boilerplate/shared';
import { SystemPromptStorage, SideButtonSettingStorage, SideButtonData, createPrompt, ApiKeyStorage } from '@chrome-extension-boilerplate/storage';
import { AIChatView } from 'react-ai-chat-view';
import type { AIChatResponse, AIModelData, ChatContextType } from 'react-ai-chat-view';
import { ChatResponse } from './types/MessageType';
import { topButtonDataList } from './FormSideButtons';


const SidePanel = () => {
  const systemPrompt = useStorageSuspense(SystemPromptStorage);
  const sideButtonList = useStorageSuspense(SideButtonSettingStorage);
  const apiKeys = useStorageSuspense(ApiKeyStorage);
  console.log(!ApiKeyStorage.isSetKey(apiKeys))

  const fetchAIChatAPI = async (modelData: AIModelData, context: ChatContextType): Promise<AIChatResponse> => {
    const res: ChatResponse = await chrome.runtime.sendMessage({
      type: 'queryChatAPI',
      model: modelData.modelName,
      context: context,
    });
    if (res.status === 'error') throw new Error(res.errorMessage);
    return {
      content: res.response,
      tokenCount: res.completion_tokens,
      totalTokenCount: res.total_tokens || 0,
    };
  };



  const sideButtonDataToButtonDataList = (sideButtonDataList: SideButtonData[]) => {
    return sideButtonDataList.map(sideButtonData => {
      return {
        title: sideButtonData.additionalPrompts,
        icon: <div>{sideButtonData.displayText}</div>,
        func: async (inputTextValue: string) => {
          return { newText: inputTextValue + '\n' + sideButtonData.additionalPrompts + '\n' };
        },
        color: 'text-blue-300',
      };
    });
  };

  return (
    <div>
      {/* 画面全体に薄暗くカバーして、オプションでapi keyを設定していないことを通知 */}
      {
        !ApiKeyStorage.isSetKey(apiKeys) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="">Please set the API key in the option page.</p>
            </div>
          </div>)
      }
      <AIChatView
        {...{
          systemPrompt: createPrompt(systemPrompt),
          fetchAIChatAPI,
          topButtonDataList,
          bottomButtonDataList: sideButtonDataToButtonDataList(sideButtonList),
        }}
      />
    </div>
  );
};




export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
