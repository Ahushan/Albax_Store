import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { AutoBannerItem } from "@/data/types";

interface BannerPropType {
  BannerData: AutoBannerItem[];
}

const Slider = ({ BannerData }: BannerPropType) => {
  return (
    <div className="w-full px-2 sm:px-4 lg:px-6">
      <Swiper
        modules={[Autoplay]}
        loop
        speed={900}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="w-full rounded-2xl overflow-hidden"
      >
        {BannerData.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-video sm:aspect-16/7 lg:aspect-16/5 overflow-hidden rounded-2xl border border-gray-200/60">
              <img
                src={banner.path}
                alt={`Banner ${index}`}
                loading="lazy"
                className="
                  absolute inset-0 w-full h-full
                  object-cover
                  lg:object-center
                "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;