import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Card from "./Card.js";
import { useRef } from "react";
import type { Product } from "../../data/types.js";

interface HorizontalProductListPropTypes {
  products: Product[];
  arrows?: boolean;
  isLoading?: boolean;
}

const HorizontalProductList = ({
  products,
  arrows,
  isLoading,
}: HorizontalProductListPropTypes) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <div className="relative px-4 py-8 group">
      {arrows && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white bg-opacity-50 p-4 rounded-full shadow-md hidden group-hover:block"
          >
            <FaChevronLeft className="text-indigo-600" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white bg-opacity-50 p-4 rounded-full shadow-md hidden group-hover:block"
          >
            <FaChevronRight className="text-indigo-600" />
          </button>
        </>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.length > 0 ? (
          products.map((product, index) => (
            <Card
              id={product._id ?? ""}
              key={index}
              imageSrc={product.thumbnail}
              discount={product.discountPercent}
              title={product.title}
              description={product.description}
              rating={product.rating}
              price={product.price}
              discountPrice={product.mrp}
              isLoading={isLoading}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default HorizontalProductList;
