import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';
import { SystemPrompt } from './Prompt';

type SystemPromptStorageType = BaseStorage<SystemPrompt> & {
  setSystemPrompt: (prompt: string) => Promise<void>;
  setIncludeCutoffAndCurrentDate: (isIncludeCutoffAndCurrentDate: boolean) => Promise<void>;
};

const storage = createStorage<SystemPrompt>(
  'systemPrompt_storage',
  { systemPrompt: '', isIncludeCutoffAndCurrentDate: true },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const SystemPromptStorage: SystemPromptStorageType = {
  ...storage,
  setSystemPrompt: async prompt => {
    await storage.set(value => {
      return { ...value, systemPrompt: prompt };
    });
  },
  setIncludeCutoffAndCurrentDate: async isIncludeCutoffAndCurrentDate => {
    await storage.set(value => {
      return { ...value, isIncludeCutoffAndCurrentDate };
    });
  },
};

export default SystemPromptStorage;
