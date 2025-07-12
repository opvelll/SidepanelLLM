import '@src/Options.css';
import { ComponentPropsWithoutRef } from 'react';
import { t } from '@extension/i18n';
import { PROJECT_URL_OBJECT, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner, ToggleButton } from '@extension/ui';

const Options = () => {
  const theme = useStorage(exampleThemeStorage);

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

export default withErrorBoundary(withSuspense(Options, <LoadingSpinner />), ErrorDisplay);
