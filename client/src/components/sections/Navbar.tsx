import { Link } from "react-router-dom";
import { Categories } from "@/data/constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

const Navbar = () => {
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = Math.abs(e.touches[0].clientX - startX.current);
    if (diff > 10) {
      isDragging.current = true;
    }
  };

  return (
    <nav className="w-full py-2 flex items-center justify-between">
      <div
        className="flex-1 ml-6 overflow-x-auto whitespace-nowrap no-scrollbar touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="flex items-center gap-6 w-max">
          {Categories.map((category, idx) => (
            <DropdownMenu key={idx}>
              <DropdownMenuTrigger
                className="outline-none"
                onClick={(e) => {
                  if (isDragging.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <span
                  className="flex items-center gap-1 cursor-pointer font-medium 
                  bg-gray-100/20 text-black p-1 px-4 pl-6 justify-center lexend  
                  rounded-br-full rounded-tl-full uppercase tracking-wider 
                  text-[12px] transition"
                >
                  {category.name}
                  <ChevronDown className="w-4 h-4" />
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white shadow-xl border-none rounded-md w-48">
                {category.subcategories.map((sub, sidx) => (
                  <DropdownMenuSub key={sidx}>
                    <DropdownMenuSubTrigger className="hover:bg-red-900/10 text-gray-900 font-medium text-sm">
                      {sub.name}
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent className="bg-white border-none shadow-md rounded-md">
                      {sub.variants.map((v, vidx) => (
                        <DropdownMenuItem key={vidx}>
                          <Link
                            to="/"
                            className="hover:bg-red-900/10 text-gray-900 font-medium text-sm w-full p-1.5"
                          >
                            {v}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
