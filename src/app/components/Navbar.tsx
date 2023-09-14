import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import CartIcon from "./CartIcon";
import Image from "next/image";


const user=false

const Navbar = () => {

  
  return (
    <div className="h-12 flex justify-between text-red-500 p-4 items-center border-b-2 border-b-red-500 uppercase md:h-20 lg:px-20 xl:px-40">
      <div className="hidden md:flex gap-4 ">
        <Link className="hover:font-bold transition-all duration-300 " href={"/"}>Homepage</Link>
        <Link className="hover:font-bold transition-all duration-300 " href={"/menu"}>Menu</Link>
        <Link className="hover:font-bold transition-all duration-300 " href={"/"}>Contact</Link>
      </div>
      <div className="text-xl">
        <Link className="font-bold" href={"/"}>Restaurant</Link>
      </div>

      <div className="md:hidden">
        <Menu/>
      </div>

      <div className="hidden md:flex gap-4 items-center cursor-pointer">

        <div className="flex justify-center items-center bg-orange-400 rounded-md px-1 px-y text-white">
        <Image src={"/phone.png"} width={20} height={20} alt=""></Image>

        <span className="hover:scale-90 hover:font-bold transition-all duration-300 ">123-456-789</span>
        </div>

      {!user ? (
          <Link className="hover:font-bold transition-all duration-300 " href={"/login"}>Login</Link>
        ) : (
          <Link className="hover:font-bold transition-all duration-300 " href={"/order"}>Orders</Link>
        )}
        <CartIcon/>
      </div>



    </div>
  );
};

export default Navbar;
