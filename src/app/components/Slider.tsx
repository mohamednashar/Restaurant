"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";


const data = [
  {
    id: 1,
    title: "always fresh & always crispy & always hot",
    image: "/slide1.png",
  },
  {
    id: 2,
    title: "we deliver your order wherever you are in NY",
    image: "/slide2.png",
  },
  {
    id: 3,
    title: "the best pizza to share with your family",
    image: "/slide3.jpg",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  
  useEffect(() => {


    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);

  }, []);


  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] md:flex-row">
      <div className="flex-1 flex items-center justify-center flex-col gap-8 text-red-500 font-bold md:h-full bg-fuchsia-50">
        <h1 className="text-5xl text-center p-4 uppercase md:text-5xl lg:text-6xl xl:text-7xl">
          {data[currentSlide].title}
        </h1>
        <button className="bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 py-4 px-8 text-white mb-2">
          Order Now
        </button>
      </div>

      <div className="flex-1 relative w-full md:h-full">
        <Image
          src={data[currentSlide].image}
          alt={""}
          fill
          className="object-cover"
        ></Image>
      </div>
    </div>
  );
};

export default Slider;
