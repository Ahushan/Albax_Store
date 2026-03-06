import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { HiChevronDown } from "react-icons/hi";
import { Categories } from "@/data/constant";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openVariantSheet, setOpenVariantSheet] = useState(false);

  const [selectedSub, setSelectedSub] = useState<{
    category: string;
    subcategory: string;
    variants: string[];
  } | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleVariantOpen = (
    categoryName: string,
    subcategoryName: string,
    variants: string[],
  ) => {
    setSelectedSub({
      category: categoryName,
      subcategory: subcategoryName,
      variants,
    });

    setOpenVariantSheet(true);
  };

  return (
    <>
      {/* MAIN SIDEBAR */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className="w-64 p-0 overflow-y-auto bg-white ml-1 my-1 rounded-xl no-scrollbar"
        >
          <SheetHeader className="border-b border-gray-200 px-4 py-3">
            <SheetTitle className="text-black lexend font-bold text-lg">
              Categories
            </SheetTitle>
          </SheetHeader>

          {/* CATEGORY LIST */}
          <motion.ul
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-4 space-y-4"
          >
            {Categories.map((category, idx) => (
              <li key={idx}>
                <details className="text-black aboreto font-semibold cursor-pointer">
                  <summary className="flex items-center justify-between hover:scale-105 transition-all">
                    <span>{category.name}</span>
                    {category.subcategories.length > 0 && <HiChevronDown />}
                  </summary>

                  <ul className="ml-3 mt-2 space-y-2">
                    {category.subcategories.map((sub, subIdx) => (
                      <li
                        key={subIdx}
                        className="flex justify-between items-center px-1"
                      >
                        <Link
                          to={`/products?q=${encodeURIComponent(sub.name)}`}
                          className="text-sm text-gray-700 pt-1 hover:text-black aboreto"
                          onClick={() => onClose(false)}
                        >
                          {sub.name}
                        </Link>

                        <button
                          onClick={() =>
                            handleVariantOpen(
                              category.name,
                              sub.name,
                              sub.variants,
                            )
                          }
                        >
                          <PlusCircle className="w-5 hover:scale-110 transition-all" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </motion.ul>
        </SheetContent>
      </Sheet>

      {/* VARIANT SHEET */}
      <Sheet open={openVariantSheet} onOpenChange={setOpenVariantSheet}>
        <SheetContent
          side={isMobile ? "right" : "left"}
          className="w-64 p-0 overflow-y-auto bg-white rounded-xl no-scrollbar"
        >
          <SheetHeader className="border-b border-gray-200 px-4 py-3">
            <SheetTitle className="text-black lexend font-bold text-sm">
              {selectedSub && selectedSub.subcategory}
            </SheetTitle>
          </SheetHeader>

          {/* VARIANT LIST */}
          <motion.ul
            initial={{ opacity: 0, x: isMobile ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-4 space-y-3"
          >
            {selectedSub?.variants?.map((variant, idx) => (
              <li key={idx}>
                <Link
                  to={`/products?q=${encodeURIComponent(variant)}`}
                  className="text-sm text-gray-700 pt-1 hover:text-black aboreto font-semibold cursor-pointer"
                  onClick={() => {
                    setOpenVariantSheet(false);
                    onClose(false);
                  }}
                >
                  {variant}
                </Link>
              </li>
            ))}
          </motion.ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
