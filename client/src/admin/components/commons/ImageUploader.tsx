import React, { useState, useCallback, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type UploadedImage } from "@/admin/types/image.js";
import api from "@/api/API.js";

interface ImageUploaderProps {
  uniqueId: string | number;
  folderUrl?: string;
  initialImages?: UploadedImage[];
  multiple?: boolean;
  maxSizeMB?: number;
  onUploadComplete: (images: UploadedImage[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  uniqueId,
  folderUrl = "products",
  initialImages = [],
  multiple = true,
  maxSizeMB = 5,
  onUploadComplete,
}) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  /* ---------------- HANDLE UPLOAD ---------------- */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    setUploading(true);

    for (const file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Max ${maxSizeMB}MB allowed`);
        continue;
      }

      try {
        // Get Cloudinary signature
        const { data } = await api.get(
          `/cloudinary/signature?folder=${folderUrl}`,
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", data.apiKey);
        formData.append("timestamp", String(data.timestamp));
        formData.append("signature", data.signature);
        formData.append("folder", data.folder);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent: any) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              setProgress((prev) => ({
                ...prev,
                [file.name]: percent,
              }));
            },
          },
        );

        const uploadedImage: UploadedImage = {
          url: uploadRes.data.secure_url,
          publicId: uploadRes.data.public_id,
        };

        // 🔥 SAFE UPDATE (no useEffect sync)
        const updated = multiple ? [...images, uploadedImage] : [uploadedImage];

        setImages(updated);
        onUploadComplete(updated);

        toast.success(`${file.name} uploaded`);

        setProgress((prev) => {
          const copy = { ...prev };
          delete copy[file.name];
          return copy;
        });
      } catch (err) {
        console.error(err);
        toast.error(`Upload failed: ${file.name}`);
      }
    }

    setUploading(false);
    if (e.target) e.target.value = "";
  };

  /* ---------------- HANDLE DELETE ---------------- */
  const removeImage = useCallback(
    async (index: number) => {
      const image = images[index];
      if (!image) return;

      if (deleting[image.publicId]) return; // prevent double click

      try {
        setDeleting((prev) => ({
          ...prev,
          [image.publicId]: true,
        }));

        await api.delete("/cloudinary/delete", {
          data: { publicId: image.publicId },
        });

        const updated = images.filter((_, i) => i !== index);

        setImages(updated);
        onUploadComplete(updated);

        toast.success("Image deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete image");
      } finally {
        setDeleting((prev) => {
          const copy = { ...prev };
          delete copy[image.publicId];
          return copy;
        });
      }
    },
    [images, deleting, onUploadComplete],
  );

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <motion.label
        htmlFor={`image-upload-${uniqueId}`}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-purple-500 hover:border-blue-500 hover:bg-purple-50"
          } text-gray-500`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={() => setIsDragOver(false)}
      >
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ImagePlus className="w-8 h-8 mb-2" />
              <p className="text-sm">Click to upload images</p>
              <p className="text-xs text-gray-400">
                PNG, JPG up to {maxSizeMB}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          id={`image-upload-${uniqueId}`}
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={uploading}
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.label>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.entries(progress).map(([fileName, percent]) => (
          <motion.div
            key={fileName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
              <motion.div
                className="bg-blue-500 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {fileName}: {percent}%
            </p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, index) => {
          const isDeleting = deleting[img.publicId];

          return (
            <motion.div
              key={img.publicId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative group"
            >
              <img
                src={img.url}
                alt="uploaded"
                className="w-full h-32 object-cover rounded-lg shadow"
              />

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => removeImage(index)}
                className={`absolute top-2 right-2 p-1 rounded-full text-white transition
                  ${
                    isDeleting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
