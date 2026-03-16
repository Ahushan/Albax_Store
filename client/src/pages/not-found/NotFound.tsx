import { Link } from "react-router-dom";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="relative">
          <h1 className="text-[10rem] font-black text-gray-900 leading-none select-none">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 -mt-8">
          Page Not Found
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          The page you're looking for doesn't exist, has been moved, or is
          temporarily unavailable.
        </p>

        <div className="flex gap-3 mt-2">
          <Button
            asChild
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/products">
              <Search className="w-4 h-4 mr-2" /> Browse Products
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
