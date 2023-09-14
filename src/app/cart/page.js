"use client";

import Image from "next/image";
import React, { useState } from "react";
import { remove,clear } from "@/Redux/CartSlice";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  let x = 0;
  const price = () => {
    cart.map((item) => {
      x += Number(item.total);
    });
    return Number(x);
  };

  let z = 0;
  const qunt = () => {
    cart.map((item) => {
      z += Number(item.quantity);
    });
    return Number(z);
  };

  return (
    
    <div className=" h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col  text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
    
      <div className="scrollbarr h-1/2 overflow-x-hidden p-4 flex flex-col  overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2">
        <table className="w-full ">
          <thead className="border-b font-medium dark:border-neutral-300 ">
            <tr>
              <th scope="col" className=" text-center py-4 hidden md:inline-block">Image</th>
              <th scope="col" className=" text-center py-4">Meal</th>
              <th scope="col" className="px-3 text-center py-4">Price</th>
              <th scope="col" className="px-3 text-center py-4">Quantity</th>
              <th scope="col" className="px-3 text-center py-4">Delete</th>
            </tr>
          </thead>
          <tbody>
     
          { (cart.map((item)=>{
        return(
            <tr key={item.item.title}
              className=" border-b transition duration-500 ease-in-out hover:bg-fuchsia-50 dark:border-neutral-500 dark:hover:bg-red-100">
              <td className="text-center whitespace-nowrap  py-4 font-medium hidden md:inline-block"><Image src={item.item.img} alt="" width={110} height={110} className="hover:rotate-45 transition-all duration-700  " /></td>
              <td className=" text-center py-4 font-bold">{item.item.title}</td>
              <td className="text-center font-bold whitespace-nowrap mx-5  py-4">${item.total.toFixed(2)}</td>
              <td className="text-center  font-bold whitespace-nowrap mx-5  py-4">{item.quantity}</td>
              <td className="text-center  font-bold whitespace-nowrap mx-5 py-4 "><span onClick={()=>dispatch(remove(item.item))} className="cursor-pointer bg-red-500 hover:bg-red-600 text-white text-center py-2 px-4 rounded-full transition-all duration-200">X</span></td>
            </tr>
                )
              }))}
          
          </tbody>
        </table>
    



  {cart.length!== 0 && ( <button onClick={()=>dispatch(clear())} className=" bg-red-500 rounded-full font-bold mt-5 p-3 text-white text-md hover:scale-95 hover:bg-red-600 transition-all duration-500 ">Clear All </button> )}

</div>

      {/* CheckOut */}

      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal ({qunt()})</span>
          <span className="">${price().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Service Cost</span>
          <span className="">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="">Delivery Cost</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOTAL(INCL. VAT)</span>
          <span className="font-bold">${(price() / 2).toFixed(2)}</span>
        </div>
        <button className="bg-red-500 text-white p-3 rounded-full w-1/2 self-end hover:bg-red-600 transition-all duration-300">
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CartPage;
