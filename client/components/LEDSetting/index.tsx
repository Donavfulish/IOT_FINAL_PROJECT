"use client"

import React, { useState } from 'react'
import { Lightbulb, Clock } from 'lucide-react'

type LedMode = 'Manual' | 'Automatic';
type Config = {
  ledMode: LedMode,
  manualOn: boolean,
  startTime: string,
  endTime: string,
};

const LEDSetting = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [originalConfig, setOriginalConfig] = useState<Config>({
    ledMode: 'Manual',
    manualOn: true,
    startTime: '00:00',
    endTime: '00:00'
  });
  const [editConfig, setEditConfig] = useState<Config>({
    ledMode: 'Manual',
    manualOn: true,
    startTime: '00:00',
    endTime: '00:00'
  });

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
      <Lightbulb />
      <p className="text-md font-medium">LED Light Control</p>
    </div>

    {editMode && <div className="w-full grid grid-cols-2 justify-center gap-2 text-sm">
      {originalConfig.ledMode == 'Automatic' ?
        <button className="bg-[#1c2128] p-1 rounded-md" onClick={() => setEditConfig(prev => ({...prev, ledMode: 'Manual'}))} >Manual</button> :
        <button className="bg-[#00c2ff] p-1 rounded-md text-black">Manual</button>}
      {originalConfig.ledMode == 'Manual' ?
        <button className="bg-[#1c2128] p-1 rounded-md" onClick={() => setEditConfig(prev => ({...prev, ledMode: 'Automatic'}))}>Automatic</button> :
        <button className="bg-[#00c2ff] p-1 rounded-md text-black">Automatic</button>}
    </div>}

    <div className="w-full">
      {editConfig.ledMode == 'Manual' && <div className="flex flex-row justify-between items-center my-1">
        <span>Light On</span>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={editConfig.manualOn} onChange={e => setEditConfig(prev => ({...prev, manualOn: !prev.manualOn}))} className="sr-only peer" defaultChecked disabled={!editMode} />
          <div className="relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
        </label>
      </div>}
      {editConfig.ledMode == 'Automatic' && <div>
        <p className="font-semibold">Light-on Time</p>
        <div className="my-3 relative flex flex-row justify-between items-center"> 
          <span>From</span>
          <input type="time" lang="en-GB" value={editConfig.startTime} onChange={e => setEditConfig(prev => ({...prev, startTime: e.target.value}))} className="bg-[#1c2128] text-white px-2 py-1 rounded-sm mt-1" disabled={!editMode} />
          <span>to</span>
          <input type="time" lang="en-GB" value={editConfig.endTime} onChange={e => setEditConfig(prev => ({...prev, endTime: e.target.value}))} className="bg-[#1c2128] text-white px-2 py-1 rounded-sm mt-1" disabled={!editMode} />
        </div>
      </div>}
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

export default LEDSetting