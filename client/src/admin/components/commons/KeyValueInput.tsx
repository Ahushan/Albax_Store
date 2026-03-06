import { X, Plus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface KeyValueInputProps {
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueInput = ({
  value = {},
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueInputProps) => {
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");

  const addEntry = () => {
    const trimmedKey = inputKey.trim();
    const trimmedValue = inputValue.trim();

    if (!trimmedKey) return;

    if (value[trimmedKey]) {
      toast.error("Key already exists!");
      return;
    }

    const updated = {
      ...value,
      [trimmedKey]: trimmedValue,
    };

    onChange(updated);

    setInputKey("");
    setInputValue("");
  };

  const removeEntry = (key: string) => {
    const updated = { ...value };
    delete updated[key];
    onChange(updated);
  };

  return (
    <div className="rounded-sm p-4 space-y-3">
      {/* Existing Entries */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(value).map(([k, v]) => (
          <div
            key={k}
            className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm shadow"
          >
            <span>
              <strong>{k} :</strong> {v}
            </span>
            <X
              size={14}
              className="cursor-pointer hover:text-xl"
              onClick={() => removeEntry(k)}
            />
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={keyPlaceholder}
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring focus:ring-purple-500"
        />

        <input
          type="text"
          placeholder={valuePlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addEntry();
            }
          }}
          className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring focus:ring-purple-500"
        />

        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
};
