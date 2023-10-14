"use client";

import { useProducts } from "@/api/products";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export default function Page() {
  const products = useProducts();

  return (
    <main className="h-screen w-full">
      <Slider
        infinite
        autoplay
        autoplaySpeed={3 * 1000}
        adaptiveHeight
        arrows={false}
        fade
        slide="img"
        lazyLoad="ondemand"
        className="h-full w-full"
      >
        {products.data?.data
          .map((item) => item.images)
          .flat()
          .map((item, idx) => (
            <Image
              key={item.id + idx}
              src={item.src}
              alt={"전시용 이미지 " + idx}
              width={item.width}
              height={item.height}
              className="h-screen w-full object-contain"
            />
          ))}
      </Slider>
    </main>
  );
}
