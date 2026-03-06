import { Link } from "react-router-dom";
type CategoryIconStripProps = {
  heroIconCards?: { img: string; name: string; path: string }[];
  detailedIconCards?: { img: string; name: string; path?: string }[];
};

const CategoryIconStrip = ({
  heroIconCards,
  detailedIconCards,
}: CategoryIconStripProps) => {
  const cardsToRender = heroIconCards || detailedIconCards || [];
  return (
    <div className=" mx-auto p-4">
      <div className="flex gap-4 overflow-x-auto flex-nowrap no-scrollbar p-4 items-center justify-start">
        {cardsToRender.map((card, index) => (
          <Link
            key={index}
            to={card.path || "#"}
            className="shrink-0 flex flex-col items-center gap-2 overflow-hidden
            p-2 rounded-lg w-[110px] hover:translate-y-1 hover:scale-105 transition-all duration-300 relative"
          >
            <img
              src={card.img}
              alt={card.name}
              className="w-12 h-12 object-contain z-10"
            />
            <h2 className="text-center lexend text-xs font-semibold text-nowrap z-10 text-black">
              {card.name}
            </h2>
            <div className="bg-white/90 rounded-full w-20 h-10 absolute bottom-1 z-2 shadow-sm hover:shadow-lg"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryIconStrip;
