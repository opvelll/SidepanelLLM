import { BaseStorage, createStorage, StorageType } from './base';

export type APIKeySettings = { openAIKey: string; googleKey: string };

type ApiKeyStorageType = BaseStorage<APIKeySettings> & {
  setOpenAIKey: (key: string) => Promise<void>;
  getKeys: () => Promise<APIKeySettings>;
  isSetKey: (keys: APIKeySettings) => boolean;
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
  isSetKey: (keys: APIKeySettings) => {
    return Object.values(keys).some(key => key !== '');
  },
};

export default ApiKeyStorage;
