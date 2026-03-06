import React, { useState } from "react";

type Props = {
  images: string[];
  alt?: string;
};

const ProductImages: React.FC<Props> = ({ images = [], alt = "Product image" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images && images.length > 0 ? images[activeIndex] : "/placeholder.svg";

  return (
    <div>
      <div className="w-full h-96 bg-white rounded-lg shadow flex items-center justify-center overflow-hidden">
        <img src={active} alt={`${alt}-${activeIndex}`} className="object-contain w-full h-full" />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images && images.length > 0 ? (
          images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-20 h-20 rounded border overflow-hidden shrink-0 ${idx === activeIndex ? "ring-2 ring-indigo-500" : "border-gray-200"}`}
              aria-label={`Select image ${idx + 1}`}
            >
              <img src={src} alt={`thumb-${idx}`} className="object-cover w-full h-full" />
            </button>
          ))
        ) : (
          <div className="text-gray-500">No images</div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
