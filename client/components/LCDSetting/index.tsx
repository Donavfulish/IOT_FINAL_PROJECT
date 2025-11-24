"use client"

import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'

type LCDMode = 'trash-level' | 'message';
type Config = {
  lcdMode: LCDMode,
  lcdMessage: string
}

const maxCharacters = 160;

const LCDSetting = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [originalConfig, setOriginalConfig] = useState<Config>({
    lcdMode: 'trash-level',
    lcdMessage: ''
  });
  const [editConfig, setEditConfig] = useState<Config>({
    lcdMode: 'trash-level',
    lcdMessage: ''
  });

  function handleLCDMessageChange(e: any): void {
    const message: string = e.target.value;
    if (message.length > maxCharacters) return;
    setEditConfig(prev => ({...prev, lcdMessage: message}));
  }

  function handleSave() {
    setOriginalConfig(editConfig);
    setEditMode(false);
    // TODO
  }

  function handleCancelSave() {
    setEditConfig(originalConfig);
    setEditMode(false);
    // TODO
  }

  return <div className="card-primary flex flex-col gap-4 items-center">
    <div className="w-full flex flex-row gap-2 justify-baseline mb-2">
      <MessageCircle />
      <p className="text-md font-medium">LCD Display</p>
    </div>
    <div className="w-full flex flex-col gap-4 items-center">
      {editMode && <div className="w-full grid grid-cols-2 justify-center gap-2 text-sm">
        {editConfig.lcdMode == 'message' ?
          <button className="bg-[#1c2128] p-1 rounded-md" onClick={() => setEditConfig(prev => ({...prev, lcdMode: 'trash-level'}))}>Trash Level</button> :
          <button className="bg-[#00c2ff] p-1 rounded-md text-black">Trash Level</button>}
        {editConfig.lcdMode == 'trash-level' ?
          <button className="bg-[#1c2128] p-1 rounded-md" onClick={() => setEditConfig(prev => ({...prev, lcdMode: 'message'}))}>Message</button> :
          <button className="bg-[#00c2ff] p-1 rounded-md text-black">Message</button>}
      </div>}
      <div className="w-full">
        {editConfig.lcdMode == 'trash-level' && <div className="w-full card-secondary h-30 flex flex-row items-center justify-center">
          <p className="text-[#00c2ff] text-4xl font-bold ">45%</p>
        </div>}
        {editConfig.lcdMode == 'message' && <div className="flex flex-col items-start justify-center gap-2">
          <textarea disabled={!editMode} onChange={handleLCDMessageChange} value={editConfig.lcdMessage} className="w-full card-secondary h-30" />
          {editMode && <p className="text-sm text-gray-500">Characters: {editConfig.lcdMessage.length} / {maxCharacters}</p>}
        </div>
        }
      </div>
    </div>

    {editMode ? <div className="w-full grid grid-cols-2 gap-2 select-none">
      <button onClick={handleSave} className="mt-2 w-full py-1 bg-[#00c2ff] text-black rounded-md hover:bg-[#4fd6ff] transition-colors duration-200">
        Save
      </button>
      <button onClick={handleCancelSave} className="mt-2 w-full border border-gray-500 py-1 bg-[#13161b] text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200">
        Cancel
      </button>
    </div> : <div className="w-full">
      <button onClick={() => setEditMode(true)} className="mt-2 w-full py-1 bg-[#00c2ff] text-black rounded-md hover:bg-[#4fd6ff] transition-colors duration-200">
        Edit
      </button>
    </div>}
  </div>
}

export default LCDSetting