import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type OptionSettings = { systemPrompt: string };

type OptionStorageType = BaseStorage<OptionSettings> & {
  setSystemPrompt: (prompt: string) => Promise<void>;
};

const storage = createStorage<OptionSettings>(
  'option_storage',
  { systemPrompt: '' },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const OptionStorage: OptionStorageType = {
  ...storage,
  setSystemPrompt: async prompt => {
    await storage.set(keys => {
      return { ...keys, systemPrompt: prompt };
    });
  },
};

export default OptionStorage;
