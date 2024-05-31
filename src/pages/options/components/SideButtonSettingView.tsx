import useStorage from '@root/src/shared/hooks/useStorage';
import SideButtonSettingStorage, {
  SideButtonData,
  SideButtonList,
} from '@root/src/shared/storages/SideButtonSettingStorage';
import { useState, Fragment } from 'react';

export default function SideButtonSettingView() {
  const sideButtonDataList = useStorage(SideButtonSettingStorage);

  const [sideButtonFormList, setSideButtonFormList] = useState<SideButtonList>(sideButtonDataList);

  const updateSideButtonFormList = (index: number, sideButtonFormData: SideButtonData) => {
    setSideButtonFormList(sideButtonFormList => {
      const newSideButtonFormList = [...sideButtonFormList];
      newSideButtonFormList[index] = sideButtonFormData;
      return newSideButtonFormList;
    });
  };

  const [addSideButtonForm, setAddSideButtonForm] = useState<SideButtonData>({
    displayText: '',
    additionalPrompts: '',
  });

  const handleAddSideButton = async () => {
    await SideButtonSettingStorage.addSideButton(addSideButtonForm);
    const newSideButtonDataList = await SideButtonSettingStorage.get();
    setSideButtonFormList(newSideButtonDataList);
    setAddSideButtonForm({
      displayText: '',
      additionalPrompts: '',
    });
  };
  return (
    <div className="space-y-6 px-4">
      <h2 className="text-lg font-bold border-b pb-1">Side Buttons</h2>
      <div className="grid grid-cols-7 gap-x-2 gap-y-4">
        <div className=" text-sm font-medium text-gray-700">Button Display Text</div>
        <div className=" text-sm font-medium text-gray-700 col-span-4">Additional Prompts</div>
        <div className=" text-sm font-medium text-gray-700 col-span-2"></div>
        {sideButtonFormList.map((sideButtonForm, index) => (
          <Fragment key={index}>
            <input
              className="border "
              type="text"
              value={sideButtonForm.displayText}
              onChange={e => updateSideButtonFormList(index, { ...sideButtonForm, displayText: e.target.value })}
            />
            <textarea
              className="border col-span-4"
              value={sideButtonForm.additionalPrompts}
              onChange={e => updateSideButtonFormList(index, { ...sideButtonForm, additionalPrompts: e.target.value })}
            />
            <button
              type="button"
              className="border  bg-blue-400 text-white rounded hover:bg-blue-700 col-span-1"
              onClick={() => {
                SideButtonSettingStorage.setSideButtonByIndex(sideButtonForm, index);
              }}>
              Save
            </button>
            <button
              type="button"
              className="border  bg-red-400 text-white rounded hover:bg-red-700 col-span-1"
              onClick={() => {
                SideButtonSettingStorage.removeSideButton(index);
                setSideButtonFormList(sideButtonFormList.filter((_, i) => i !== index));
              }}>
              Delete
            </button>
          </Fragment>
        ))}
        <input
          className="border"
          type="text"
          value={addSideButtonForm.displayText}
          onChange={e => setAddSideButtonForm({ ...addSideButtonForm, displayText: e.target.value })}
        />
        <textarea
          className="border col-span-4"
          value={addSideButtonForm.additionalPrompts}
          onChange={e => setAddSideButtonForm({ ...addSideButtonForm, additionalPrompts: e.target.value })}
        />
        <button
          type="button"
          className="border bg-blue-400 text-white rounded hover:bg-blue-700 col-span-2"
          onClick={handleAddSideButton}>
          Add
        </button>
      </div>
    </div>
  );
}
