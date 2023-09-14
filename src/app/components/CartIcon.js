"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const CartIcon = () => {
const item=useSelector((state)=>state.cart)

  return (
    <Link href="/cart" className="flex items-center gap-4 hover:font-bold transition-all duration-300">
      <div className="relative w-8 h-8 md:w-5 md:h-5">
        <Image src="/cart.png" alt="" fill  />
      </div>
      <span>Cart ({item.length})</span>
    </Link>
  );
};

export default CartIcon;
