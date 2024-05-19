import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type APIKeySettings = { openAIKey: string; googleKey: string };

type OptionStorageType = BaseStorage<APIKeySettings> & {
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

const OptionStorage: OptionStorageType = {
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

export default OptionStorage;
