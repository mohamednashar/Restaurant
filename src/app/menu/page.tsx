import { menu } from "@/data";
import Link from "next/link";
import React from "react";

const MenuPage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem) lg:px-20 xl:px-40 ">
      {menu.map((category) => {
        return (
          <Link
            href={`/menu/${category.slug}`}
            key={category.id}
            style={{ backgroundImage: `url(${category.img})` }}
            className="w-full h-1/3 bg-cover p-8 md:h-1/2 hover:scale-105 transition-all duration-500 rounded-md"
          >
            <div className={`text-${category.color} w-1/2`}>
              <h1 className="uppercase font-bold text-3xl">{category.title}</h1>
              <p className="text-sm my-8">{category.desc}</p>
              <button className="hidden 2xl:block py-2 px-4 rounded-md bg-neutral-800 text-yellow-200 transition-all duration-300 hover:bg-neutral-900 hover:text-red-400">
                Explore
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MenuPage;
