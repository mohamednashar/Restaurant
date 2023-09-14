import Image from "next/image";
import React from "react";



const Offer = () => {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-black text-white md:justify-between md:bg-[url('/offerBg.png')] md:h-[70vh]">
      {/* Text Container */}

      <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 p-6">
        <h1 className="text-white text-5xl font-bold xl:text-6xl">
          Delicious Burger & French Fry
        </h1>
        <p className="text-white xl:text-xl">
          Progressively simplify effective e-toilers and process-centric methods
          of empowerment. Quickly pontificate parallel.
        </p>


      
        <button className="bg-red-500 rounded-full px-6 py-3 transition-all duration-300 hover:bg-red-600">Order Now</button>
      </div>
      

      {/* Image Container */}

      <div className="relative flex-1 w-full md:h-full">
        <Image
          src={"/burgerfries.png"}
          alt={""}
          fill
          className="object-contain"
          
        />
      </div>
      
    </div>
    
  );
};

export default Offer;
