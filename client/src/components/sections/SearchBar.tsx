import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/products?q=${encodeURIComponent(searchText.trim())}`);
    setExpanded(false);
    setSearchText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <motion.div
      initial={{ width: 47 }}
      animate={{ width: expanded ? 320 : 47 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => {
        if (!searchText) setExpanded(false);
      }}
      className="flex items-center h-10 bg-white -2 rounded-full overflow-hidden shadow-sm"
    >
      <Search
        className="h-5 w-5 ml-3 text-gray-500 cursor-pointer"
        onClick={() => setExpanded(true)}
      />

      {expanded && (
        <Input
          autoFocus
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!searchText) setExpanded(false);
          }}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent text-sm"
        />
      )}
    </motion.div>
  );
};

export default SearchBar;
