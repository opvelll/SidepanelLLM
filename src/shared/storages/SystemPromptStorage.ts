import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type SystemPrompt = string;

type SystemPromptStorageType = BaseStorage<SystemPrompt> & {
  setSystemPrompt: (prompt: string) => Promise<void>;
};

const storage = createStorage<SystemPrompt>('systemPrompt_storage', '', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const SystemPromptStorage: SystemPromptStorageType = {
  ...storage,
  setSystemPrompt: async prompt => {
    await storage.set(() => prompt);
  },
};

export default SystemPromptStorage;
