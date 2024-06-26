import '@src/Options.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import APISettingView from './components/APISettingView';
import SystemPromptSettingView from './components/SystemPromptSettingView';
import SideButtonSettingView from './components/SideButtonSettingView';

const Options = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="space-y-6 bg-white p-6 shadow-md rounded-md">
        <h1 className="text-xl font-bold border-b pb-1">Option</h1>
        <APISettingView />
        <SystemPromptSettingView />
        <SideButtonSettingView />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
