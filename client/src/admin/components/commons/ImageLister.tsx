import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type UploadedImage } from "@/admin/types/image.js";

interface ImageListerProps {
  images: UploadedImage[];
  uniqueId: string | number;
  onRemove?: (index: number) => void;
  preview?: boolean;
}

export const ImageLister: React.FC<ImageListerProps> = ({
  images,
  uniqueId,
  onRemove,
  preview = true,
}) => {
  if (!images.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <AnimatePresence>
        {images.map((img, index) => (
          <motion.div
            key={img.publicId || `${uniqueId}-${index}`}
            className="relative w-24 h-24 border rounded overflow-hidden"
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.05 }}
          >
            {preview && (
              <img
                src={img.url}
                alt="uploaded"
                className="w-full h-full object-cover"
              />
            )}

            {onRemove && (
              <motion.button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{
                  scale: 1.3,
                  backgroundColor: "rgba(220, 38, 38, 0.9)",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                ✕
              </motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
