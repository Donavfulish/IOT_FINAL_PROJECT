"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

type oledMode = "trash-level" | "message";
interface Config {
  oledMode: oledMode;
  oledMessage: string;
}

const maxCharacters = 160;

interface oledSettingProps {
  isDisplayFill: boolean;
  message: string;
  fillLevel: number;
  onSave: (message: string, isDisplayFill: boolean) => Promise<void>;
  isEditable?: boolean;
}

const OledSetting: React.FC<oledSettingProps> = ({
  isDisplayFill,
  message,
  fillLevel,
  onSave,
  isEditable = false,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const [config, setConfig] = useState<Config>({
    oledMode: isDisplayFill ? "trash-level" : "message",
    oledMessage: message || "",
  });

  useEffect(() => {
    setConfig({
      oledMode: isDisplayFill ? "trash-level" : "message",
      oledMessage: message || "",
    });
  }, [isDisplayFill, message]);

  function handleoledMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newVal = e.target.value;
    if (newVal.length > maxCharacters) return;
    setConfig((prev) => ({ ...prev, oledMessage: newVal }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(config.oledMessage, config.oledMode === "trash-level");
      setEditMode(false);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save oled settings.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelSave() {
    setConfig({
      oledMode: isDisplayFill ? "trash-level" : "message",
      oledMessage: message || "",
    });
    setEditMode(false);
  }

  return (
    <div className="card-primary flex flex-col gap-4 items-center">
      <div className="w-full flex flex-row gap-2 justify-baseline mb-2">
        <MessageCircle />
        <p className="text-md font-medium">oled Display</p>
      </div>
      <div className="w-full flex flex-col gap-4 items-center">
        {editMode && (
          <div className="w-full grid grid-cols-2 justify-center gap-2 text-sm">
            <button
              className={`p-1 rounded-md transition-colors ${
                config.oledMode === "trash-level"
                  ? "bg-[#00c2ff] text-black"
                  : "bg-[#1c2128] text-white"
              }`}
              onClick={() =>
                setConfig((prev) => ({ ...prev, oledMode: "trash-level" }))
              }
            >
              Trash Level
            </button>
            <button
              className={`p-1 rounded-md transition-colors ${
                config.oledMode === "message"
                  ? "bg-[#00c2ff] text-black"
                  : "bg-[#1c2128] text-white"
              }`}
              onClick={() =>
                setConfig((prev) => ({ ...prev, oledMode: "message" }))
              }
            >
              Message
            </button>
          </div>
        )}

        <div className="w-full">
          {config.oledMode === "trash-level" && (
            <div className="w-full card-secondary h-30 flex flex-col items-center justify-center p-4 rounded-md bg-[#1c2128]">
              <span className="text-gray-400 text-sm mb-1">Current Fill</span>
              <p className="text-[#00c2ff] text-4xl font-bold">{fillLevel}%</p>
            </div>
          )}
          {config.oledMode === "message" && (
            <div className="flex flex-col items-start justify-center gap-2">
              <textarea
                disabled={!editMode}
                onChange={handleoledMessageChange}
                value={config.oledMessage}
                placeholder="Enter display message..."
                className="w-full card-secondary h-30 p-2 rounded-md bg-[#1c2128] text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#00c2ff]"
              />
              {editMode && (
                <p className="text-sm text-gray-500">
                  Characters: {config.oledMessage.length} / {maxCharacters}
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

export default OledSetting;
