"use client";
import { pizzas, pastas,burgers } from "@/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const params = useParams();
  const category = params.category;
  
    return (
      <div className="flex flex-wrap text-red-500">


        {
        
          
          category==="pastas"&&
        pastas.map((item) => {
          return (
            <Link
              className="group odd:bg-fuchsia-50 border-r-2 border-b-2 border-red-500 w-full h-[60vh] sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between "
              href={`/product/${item.id}`}
              key={item.id}
            >
              {/* Image */}
              {item.img && (
                <div className="relative h-[80%]">
                  <Image
                    src={item.img}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {/* Text */}
              <div className="flex items-center justify-between font-bold">
                <h1 className="text-2xl uppercase p-2">{item.title}</h1>
                <h2 className="group-hover:hidden text-xl">${item.price}</h2>
                <button className="hidden group-hover:block uppercase bg-red-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-600">
                  Explore
                </button>
              </div>
            </Link>
          );
        })


        }

{
        
          
        category==="pizzas"&&
      pizzas.map((item) => {
        return (
          <Link
            className="group odd:bg-fuchsia-50 border-r-2 border-b-2 border-red-500 w-full h-[60vh] sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between "
            href={`/pizza/${item.id}`}
            key={item.id}
          >
            {/* Image */}
            {item.img && (
              <div className="relative h-[80%]">
                <Image
                  src={item.img}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {/* Text */}
            <div className="flex items-center justify-between font-bold">
              <h1 className="text-2xl uppercase p-2">{item.title}</h1>
              <h2 className="group-hover:hidden text-xl">${item.price}</h2>
              <button className="hidden group-hover:block uppercase bg-red-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-600">
                Explore
              </button>
            </div>
          </Link>
        );
      })


      }

      
{
        
          
        category==="burgers"&&
      burgers.map((item) => {
        return (
          <Link
            className="group odd:bg-fuchsia-50 border-r-2 border-b-2 border-red-500 w-full h-[60vh] sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between "
            href={`/burger/${item.id}`}
            key={item.id}
          >
            {/* Image */}
            {item.img && (
              <div className="relative h-[80%]">
                <Image
                  src={item.img}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {/* Text */}
            <div className="flex items-center justify-between font-bold">
              <h1 className="text-2xl uppercase p-2">{item.title}</h1>
              <h2 className="group-hover:hidden text-xl">${item.price}</h2>
              <button className="hidden group-hover:block uppercase bg-red-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-600">
                Explore
              </button>
            </div>
          </Link>
        );
      })


      }
    

    




      </div>
    );
};

export default CategoryPage;
