"use client"
import { singleProduct } from "@/data";
import Image from "next/image";
import React from "react";
import { pizzas } from '@/data'
import PricePizza from "@/app/components/PricePizza";

interface pagePorp{
  params:{
    id:number
    category:string
    
  }
}

const SingleProductPage = ({params}:pagePorp) => {


  return (
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-around text-red-500 md:flex-row md:gap-8 md:items-center">
      {/* IMAGE CONTAINER */}
      {singleProduct.img && (
        <div className="relative w-full h-1/2 md:h-[70%]">
          <Image
          
            src={`${pizzas[params.id-1].img}`}
            key={singleProduct.id}
            alt=""
            className="object-contain hover:rotate-90 transition-all duration-500 hover:scale-90"
            fill
          />
        </div>
      )}
      {/* TEXT CONTAINER */}

      
      <div className="h-1/2 flex flex-col gap-4 md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
        <h1 className="text-3xl font-bold uppercase xl:text-5xl">{pizzas[params.id-1].title}</h1>
        <p>{pizzas[params.id-1].desc}</p>
        <PricePizza price={singleProduct.price} id={singleProduct.id} options={singleProduct.options}/>
       
      </div>
    </div>
  );
};

export default SingleProductPage;
