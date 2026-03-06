import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/provider/useAuth";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export interface CardProps {
  id: string | number;
  imageSrc?: string;
  discount?: number;
  title?: string;
  description?: string;
  rating?: number;
  price?: number;
  discountPrice?: number;
  isLoading?: boolean;
}

const Cards = ({
  id,
  discount,
  title,
  description,
  rating,
  price,
  discountPrice,
  imageSrc,
  isLoading,
}: CardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleBuyNow = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await addToCart(String(id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="flex shrink-0 flex-col gap-2 w-60 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="overflow-hidden h-60 rounded-t-xl relative">
        {isLoading ? (
          <Skeleton height="100%" />
        ) : (
          <motion.img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {!isLoading && discount && discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-red-900 text-white text-xs font-bold">
            {discount}%
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4 flex flex-col gap-1 grow">
        <p className="font-light text-xs">
          {isLoading ? <Skeleton width={80} /> : title}
        </p>

        <p className="font-normal text-sm line-clamp-2">
          {isLoading ? <Skeleton count={2} /> : description}
        </p>

        <div className="text-sm text-yellow-500">
          {isLoading ? (
            <Skeleton width={100} />
          ) : (
            "★".repeat(Math.floor(rating || 0)) +
            "☆".repeat(5 - Math.floor(rating || 0))
          )}
        </div>

        <div className="flex justify-between mt-1">
          {isLoading ? (
            <>
              <Skeleton width={40} />
              <Skeleton width={50} />
            </>
          ) : (
            <>
              <div className="text-sm line-through text-gray-400">₹{price}</div>
              <div className="text-red-600 font-semibold">₹{discountPrice}</div>
            </>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between items-center px-4 pb-4">
        {isLoading ? (
          <Skeleton height={32} width={120} />
        ) : (
          <>
            <motion.button
              onClick={handleBuyNow}
              whileTap={{ scale: 0.9 }}
              className="grow mr-2 py-1.5 px-2 bg-linear-to-r from-red-800 via-black to-blue-800 text-white rounded-md font-semibold"
            >
              Buy Now
            </motion.button>

            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.85 }}
              className="p-2 border border-red-900 rounded-md text-red-900 hover:bg-red-900 hover:text-white transition"
            >
              <ShoppingCart size={18} />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Cards;
