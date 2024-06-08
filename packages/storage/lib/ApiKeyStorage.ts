import { BaseStorage, createStorage, StorageType } from './base';

export type APIKeySettings = { openAIKey: string; googleKey: string };

type ApiKeyStorageType = BaseStorage<APIKeySettings> & {
  setOpenAIKey: (key: string) => Promise<void>;
  getKeys: () => Promise<APIKeySettings>;
};

const storage = createStorage<APIKeySettings>(
  'option_storage_keys',
  { openAIKey: '', googleKey: '' },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const ApiKeyStorage: ApiKeyStorageType = {
  ...storage,
  setOpenAIKey: async key => {
    await storage.set(keys => {
      return { ...keys, openAIKey: key };
    });
  },
  getKeys: async () => {
    return storage.get();
  },
};

export default ApiKeyStorage;
