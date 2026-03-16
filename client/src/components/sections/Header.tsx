import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  LogOut,
  Package,
  ChevronDown,
  UserCircle,
  Menu,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import { useAuth } from "@/context/provider/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/LogosImages/albax_logo_2.png";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  /* Hide / Show Header on Scroll */
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setScrolled(currentScroll > 20);

      if (currentScroll > lastScrollY.current && currentScroll > 120) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header
        className={`fixed rounded-b-md top-0 left-0 w-full z-50 transition-all duration-300
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
        backdrop-blur-xl bg-white/70 border-b border-white/70 shadow-sm
        `}
      >
        {/* Top bar */}
        <div className="py-3 flex items-center h-10 overflow-visible w-full justify-center  gap-2 px-2">
          <div className="image-container w-20 h-20 relative overflow-visible">
            <img
              src={logo}
              alt=""
              className="object-cover -left-2.5 rotate-[-10deg] scale-140 top-[22px] absolute"
            />
          </div>

          <p className="font-bold text-[10px] absolute top-3 right-3 text-black uppercase">
            India No.1 <br />
            Wholesale Online Store
          </p>
        </div>

        {/* Search + Icons */}
        <div className="mt-2 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between relative">
            {/* Search */}
            <div className="rounded-full h-10 w-full max-w-md mx-3">
              <SearchBar />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/wishlist"
                    className="relative p-2 text-black hover:scale-110 transition rounded-lg hover:bg-white/10"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Wishlist</TooltipContent>
              </Tooltip>

              {/* Cart */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/cart"
                    className="relative p-2 text-black hover:scale-110 transition rounded-lg hover:bg-white/10"
                  >
                    <ShoppingCart className="w-5 h-5" />

                    {cart.itemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                        {cart.itemCount > 99 ? "99+" : cart.itemCount}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Cart</TooltipContent>
              </Tooltip>

              {/* User */}
              {user ? (
                <div className="ml-1" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 text-black hover:scale-110 transition p-2 rounded-lg hover:bg-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-red-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border w-56 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserCircle className="w-4 h-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        Wishlist
                      </Link>

                      <Separator className="my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="text-black hover:scale-110 hover:bg-white/10 ml-1"
                >
                  <LogOut className="w-4 h-4 mr-1.5" /> Login
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div
          className="max-w-7xl mx-auto px-4 flex items-center gap-3 py-1.5"
          ref={dropdownRef}
        >
          <button
            className="flex items-center gap-1.5 text-sm transition font-bold text-black bg-gray-100 hover:scale-110 px-3 py-2 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>

          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="flex-1 hidden md:block overflow-hidden">
            <Navbar />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;
