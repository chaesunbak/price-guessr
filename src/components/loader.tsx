"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

const LOADING_ITEMS = [
  {
    id: 1,
    message: "남은 예산을 확인하는 중 ",
    image: "/wallet.jpg",
  },
  {
    id: 2,
    message: "물건 고르는 중",
    image: "/bag.jpg",
  },
  {
    id: 3,
    message: "가격을 계산하는 중",
    image: "/pen.jpg",
  },
  {
    id: 4,
    message: "산책나갈 준비하는 중",
    image: "/dog.jpg",
  },
];

export function Loader() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LOADING_ITEMS.length);
        setIsTransitioning(false);
      }, 500); // 페이드 아웃 후 다음 아이템으로
    }, 2000); // 2초마다 변경

    return () => clearInterval(interval);
  }, []);

  const currentItem = LOADING_ITEMS[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className={clsx(
          "transition-opacity duration-500 flex flex-col items-center justify-center",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="relative w-32 h-32">
          <Image
            src={currentItem.image}
            alt={currentItem.message}
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <p className="text-lg font-medium text-center mt-4">
          {currentItem.message}
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        {LOADING_ITEMS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
