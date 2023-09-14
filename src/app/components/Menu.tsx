"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import CartIcon from "./CartIcon";

const links = [
  { id: 1, title: "Homepage", url: "/" },
  { id: 2, title: "Menu", url: "/menu" },
  { id: 3, title: "Working Hours", url: "/" },
  { id: 4, title: "Contact", url: "/" },
];

const user = false;

const Menu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {!open ? (
        <Image className="cursor-pointer"
          src={"/open.png"}
          alt=""
          width={20}
          height={20}
          onClick={() => setOpen(true)}
        />
      ) : (
        <Image  className="cursor-pointer"
          src={"/close.png"}
          alt=""
          width={20}
          height={20}
          onClick={() => setOpen(false)}
        />
      )}

     { open&&<div className="bg-red-500 absolute text-white flex flex-col items-center left-0 top-24 h-[calc(100vh-6rem)] w-full justify-center gap-8 text-3xl z-10 uppercase">
        {links.map((item) => {
          return (
            <Link href={item.url} key={item.id} onClick={()=>setOpen(false)}>
              {item.title}
            </Link>
          );
        })}
        {!user ? (
          <Link href={"/login"} onClick={()=>setOpen(false)}>Login</Link>
        ) : (
          <Link href={"/order"} onClick={()=>setOpen(false)}>Orders</Link>
        )}
        <Link href={"/cart"} onClick={()=>setOpen(false)}><CartIcon/></Link>
      </div>}
    </div>
  );
};

export default Menu;
