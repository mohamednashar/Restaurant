"use client"

import { featuredProducts } from "@/data";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { add } from "@/Redux/CartSlice";
import Link from "next/link";

const Featured = () => {


const dispatch=useDispatch()




  return (
    <div className="scrollbarr w-full overflow-x-scroll text-red-500">
      {/* Wrapper */}
      <div className="w-max flex">
        {/* Single Item */}

        {featuredProducts.map((item) => {
          return (
            <div
              key={item.id}
              className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
            >
              {/* Image Container */}
              {item.img && (
                <div className="relative flex-1 w-full hover:scale-90 transition-all duration-500">
                  <Image
                    src={item.img}
                    alt={""}
                    fill
                    className="object-contain hover:rotate-[60deg] transition-all duration-500"
                  ></Image>
                </div>
              )}
              {/* Text Container */}
              <div className="flex-1 flex flex-col gap-4 items-center text-center justify-center">
                <h1 className="text-xl font-bold uppercase hover:text-red-600 transition-all duration-300">{item.title}</h1>
                <p className="p-4">{item.desc}</p>
                <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                <Link href={"/menu"}><button className="bg-red-500 px-4 py-2 transition-all duration-300 hover:bg-red-600 rounded-full text-white">
                  Explore
                </button></Link>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Featured;
