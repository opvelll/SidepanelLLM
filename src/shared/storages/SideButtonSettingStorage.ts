import { BaseStorage, StorageType, createStorage } from './base';

export type SideButtonList = SideButtonData[];
export type SideButtonData = { displayText: string; additionalPrompts: string };

type SideButtonSettingStorageType = BaseStorage<SideButtonList> & {
  setSideButtonByIndex: (sideButton: SideButtonData, index: number) => Promise<void>;
  addSideButton: (sideButton: SideButtonData) => Promise<void>;
};

const storage = createStorage<SideButtonList>(
  'side_button_setting_storage',
  [{ displayText: '1', additionalPrompts: '概要をまとめる' }],
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const SideButtonSettingStorage: SideButtonSettingStorageType = {
  ...storage,
  setSideButtonByIndex: async (sideButton, index) => {
    await storage.set(keys => {
      const newList = keys.map((item, i) => (i === index ? sideButton : item));
      return newList;
    });
  },
  addSideButton: async sideButton => {
    await storage.set(keys => {
      return [...keys, sideButton];
    });
  },
};

export default SideButtonSettingStorage;
