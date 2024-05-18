import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type APIKeys = { openAIKey: string; googleKey: string };

type OptionStorageType = BaseStorage<APIKeys> & {
  setOpenAIKey: (key: string) => Promise<void>;
  getKeys: () => Promise<APIKeys>;
};

const storage = createStorage<APIKeys>(
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
