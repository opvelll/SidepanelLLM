import { BaseStorage, StorageType, createStorage } from './base';

export type SideButtonList = SideButtonData[];
export type SideButtonData = { displayText: string; additionalPrompts: string };

type SideButtonSettingStorageType = BaseStorage<SideButtonList> & {
  setSideButtonByIndex: (sideButton: SideButtonData, index: number) => Promise<void>;
  addSideButton: (sideButton: SideButtonData) => Promise<void>;
  removeSideButton: (index: number) => Promise<void>;
};

const storage = createStorage<SideButtonList>(
  'side_button_setting_storage',
  [
    { displayText: '1', additionalPrompts: '解説してもらえる？日本語で。' },
    { displayText: '2', additionalPrompts: '日本語訳してもらえる？' },
    { displayText: '3', additionalPrompts: '概要は？日本語で。' },
  ],
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const SideButtonSettingStorage: SideButtonSettingStorageType = {
  ...storage,
  setSideButtonByIndex: async (sideButton, index) => {
    await storage.set(keys => {
      return keys.map((item, i) => (i === index ? sideButton : item));
    });
  },
  addSideButton: async sideButton => {
    await storage.set(keys => {
      return [...keys, sideButton];
    });
  },
  removeSideButton: async index => {
    await storage.set(keys => {
      return keys.filter((_, i) => i !== index);
    });
  },
};

export default SideButtonSettingStorage;
