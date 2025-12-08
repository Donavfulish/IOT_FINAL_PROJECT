"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

type LCDMode = "trash-level" | "message";
interface Config {
  lcdMode: LCDMode;
  lcdMessage: string;
}

const maxCharacters = 160;

interface LCDSettingProps {
  isDisplayFill: boolean;
  message: string;
  fillLevel: number;
  onSave: (message: string, isDisplayFill: boolean) => Promise<void>;
  isEditable?: boolean;
}

const LCDSetting: React.FC<LCDSettingProps> = ({
  isDisplayFill,
  message,
  fillLevel,
  onSave,
  isEditable = false,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const [config, setConfig] = useState<Config>({
    lcdMode: isDisplayFill ? "trash-level" : "message",
    lcdMessage: message || "",
  });

  useEffect(() => {
    setConfig({
      lcdMode: isDisplayFill ? "trash-level" : "message",
      lcdMessage: message || "",
    });
  }, [isDisplayFill, message]);

  function handleLCDMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newVal = e.target.value;
    if (newVal.length > maxCharacters) return;
    setConfig((prev) => ({ ...prev, lcdMessage: newVal }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(config.lcdMessage, config.lcdMode === "trash-level");
      setEditMode(false);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save LCD settings.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelSave() {
    setConfig({
      lcdMode: isDisplayFill ? "trash-level" : "message",
      lcdMessage: message || "",
    });
    setEditMode(false);
  }

  return (
    <div className="card-primary flex flex-col gap-4 items-center">
      <div className="w-full flex flex-row gap-2 justify-baseline mb-2">
        <MessageCircle />
        <p className="text-md font-medium">LCD Display</p>
      </div>
      <div className="w-full flex flex-col gap-4 items-center">
        {editMode && (
          <div className="w-full grid grid-cols-2 justify-center gap-2 text-sm">
            <button
              className={`p-1 rounded-md transition-colors ${
                config.lcdMode === "trash-level"
                  ? "bg-[#00c2ff] text-black"
                  : "bg-[#1c2128] text-white"
              }`}
              onClick={() =>
                setConfig((prev) => ({ ...prev, lcdMode: "trash-level" }))
              }
            >
              Trash Level
            </button>
            <button
              className={`p-1 rounded-md transition-colors ${
                config.lcdMode === "message"
                  ? "bg-[#00c2ff] text-black"
                  : "bg-[#1c2128] text-white"
              }`}
              onClick={() =>
                setConfig((prev) => ({ ...prev, lcdMode: "message" }))
              }
            >
              Message
            </button>
          </div>
        )}

        <div className="w-full">
          {config.lcdMode === "trash-level" && (
            <div className="w-full card-secondary h-30 flex flex-col items-center justify-center p-4 rounded-md bg-[#1c2128]">
              <span className="text-gray-400 text-sm mb-1">Current Fill</span>
              <p className="text-[#00c2ff] text-4xl font-bold">{fillLevel}%</p>
            </div>
          )}
          {config.lcdMode === "message" && (
            <div className="flex flex-col items-start justify-center gap-2">
              <textarea
                disabled={!editMode}
                onChange={handleLCDMessageChange}
                value={config.lcdMessage}
                placeholder="Enter display message..."
                className="w-full card-secondary h-30 p-2 rounded-md bg-[#1c2128] text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#00c2ff]"
              />
              {editMode && (
                <p className="text-sm text-gray-500">
                  Characters: {config.lcdMessage.length} / {maxCharacters}
                </p>
              )}
            </div>
          )}
        </div>
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

export default LCDSetting;
