import React from "react";

type WholeVarientsType = {
  name: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  specs: Record<string, string | number>;
}[];
type Props = {
  variants: WholeVarientsType;
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const VariantSelector: React.FC<Props> = ({
  variants,
  selectedIndex,
  onSelect,
}) => {
  if (!Array.isArray(variants) || variants.length === 0) return null;

  return (
    <div className="my-4">
      <div className="text-sm font-medium mb-2">Choose Variant</div>

      <div className="flex flex-wrap gap-2">
        {variants.map((v, idx) => {
          const selected = idx === selectedIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(idx)}
              aria-pressed={selected}
              className={`px-3 py-2 border rounded text-sm flex items-center gap-2 transition
                ${
                  selected
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 bg-white"
                }`}
            >
              <span className="font-medium">{v.name}</span>
              <span className="text-xs text-gray-600">${v.price}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
