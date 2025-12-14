"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

type LedMode = "manual" | "auto";

interface Config {
  ledMode: LedMode;
  manualOn: boolean;
  startTime: string;
  endTime: string;
}

interface LEDSettingProps {
  mode: "auto" | "manual";
  startTime: string;
  endTime: string;
  is_led_on: boolean;
  onSave: (
    mode: "auto" | "manual",
    start: string,
    end: string,
    isLedOn: boolean,
  ) => Promise<void>;
  isEditable?: boolean;
}

const LEDSetting: React.FC<LEDSettingProps> = ({
  mode,
  startTime,
  endTime,
  is_led_on,
  onSave,
  isEditable = false,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  // State local để edit
  const [config, setConfig] = useState<Config>({
    ledMode: mode,
    manualOn: false, // Default value vì API BinDetailType chưa có field 'is_led_on'
    startTime: startTime || "18:00",
    endTime: endTime || "06:00",
  });

  // Sync props -> state
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      ledMode: mode,
      manualOn: is_led_on,
      startTime: startTime || "18:00",
      endTime: endTime || "06:00",
    }));
  }, [mode, startTime, endTime]);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(config.ledMode, config.startTime, config.endTime, config.manualOn);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save LED settings");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelSave() {
    setConfig({
      ledMode: mode,
      manualOn: false,
      startTime: startTime || "18:00",
      endTime: endTime || "06:00",
    });
    setEditMode(false);
  }

  return (
    <div className="card-primary flex flex-col gap-4 items-center">
      <div className="w-full flex flex-row gap-2 justify-baseline mb-2">
        <Lightbulb />
        <p className="text-md font-medium">LED Light Control</p>
      </div>

      {editMode && (
        <div className="w-full grid grid-cols-2 justify-center gap-2 text-sm">
          <button
            className={`p-1 rounded-md transition-colors ${
              config.ledMode === "manual"
                ? "bg-[#00c2ff] text-black"
                : "bg-[#1c2128] text-white"
            }`}
            onClick={() =>
              setConfig((prev) => ({ ...prev, ledMode: "manual" }))
            }
          >
            Manual
          </button>
          <button
            className={`p-1 rounded-md transition-colors ${
              config.ledMode === "auto"
                ? "bg-[#00c2ff] text-black"
                : "bg-[#1c2128] text-white"
            }`}
            onClick={() => setConfig((prev) => ({ ...prev, ledMode: "auto" }))}
          >
            Automatic
          </button>
        </div>
      )}

      <div className="w-full">
        {config.ledMode === "manual" && (
          <div className="flex flex-row justify-between items-center my-1">
            <span>Light On (Manual)</span>
            {/* Note: Checkbox này hiện chỉ thay đổi state local vì BinDetailType chưa có field lưu trạng thái đèn On/Off thực tế */}
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.manualOn}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, manualOn: e.target.checked }))
                }
                className="sr-only peer"
                disabled={!editMode}
              />
              <div className="relative w-9 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00c2ff] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        )}
        {config.ledMode === "auto" && (
          <div>
            <p className="font-semibold text-sm mb-2">Light-on Time</p>
            <div className="my-3 relative flex flex-row justify-between items-center gap-2">
              <span className="text-sm">From</span>
              <input
                type="time"
                value={config.startTime}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, startTime: e.target.value }))
                }
                className="bg-[#1c2128] text-white px-2 py-1 rounded-sm mt-1 border border-gray-700 focus:border-[#00c2ff] outline-none"
                disabled={!editMode}
              />
              <span className="text-sm">to</span>
              <input
                type="time"
                value={config.endTime}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className="bg-[#1c2128] text-white px-2 py-1 rounded-sm mt-1 border border-gray-700 focus:border-[#00c2ff] outline-none"
                disabled={!editMode}
              />
            </div>
          </div>
        )}
      </div>

      {isEditable &&
        (editMode ? (
          <div className="w-full grid grid-cols-2 gap-2 select-none">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-2 w-full py-1 bg-[#00c2ff] text-black rounded-md hover:bg-[#4fd6ff] transition-colors duration-200 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelSave}
              disabled={isSaving}
              className="mt-2 w-full border border-gray-500 py-1 bg-[#13161b] text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="w-full">
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 w-full py-1 bg-[#00c2ff] text-black rounded-md hover:bg-[#4fd6ff] transition-colors duration-200"
            >
              Edit
            </button>
          </div>
        ))}
    </div>
  );
};

export default LEDSetting;
