"use client";
import React, { useEffect, useState } from "react";
import { pastas} from "@/data";
import { useDispatch } from "react-redux";
import { add} from "@/Redux/CartSlice";
import { useParams } from "next/navigation";


type Props = {
  price: number;
  id: number;
  options?: { title: string; additionalPrice: number }[];
};




const PricePasta = ({ price, id, options }: Props) => {
  const [total, setTotal] = useState(price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  

  useEffect(() => {
    setTotal(
      quantity * (options ? price + options[selected].additionalPrice : price)
    );
  }, [quantity, selected, options, price]);

  const dispatch=useDispatch()

  
  const params=useParams()
  const pastaId=Number(params.id)-1
  const item=pastas[(pastaId)]

 

  
  return (
    
    
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">${total.toFixed(2)}</h2>
      {/* Options */}
      <div className="flex gap-6">

        {options?.map((option, index) => {
          return (
            <button
              onClick={() => setSelected(index)}
              className="min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md"
              style={{
                background: selected === index ? "rgb(248 113 113" : "white",
                color: selected === index ? "white" : "rgb(248 113 113",
              }}
              key={option.title}
            >
              {option.title}
            </button>
          );
        })}



      </div>
      {/* Quantity And Add */}
      <div className="flex justify-between items-center">
        {/* Quantity */}
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500 rounded-l-md rounded-r-sm">
          <span>Quantity</span>
          <div className="flex gap-5 items-center">
            <button
              onClick={() => {
                if(quantity>1)
                setQuantity(quantity - 1);
              }}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => {
               
                setQuantity(quantity + 1);
              }}
            >
              {">"}
            </button>
          </div>
        </div>

        {/* Add */}

        <div className="uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500 text-center hover:bg-red-600 rounded-r-full transition-all duration-300">
          
          <button onClick={()=>dispatch(add({item,quantity,total}))}>Add To Cart</button>
        </div>
      </div>
    </div>
  );
};

export default PricePasta;
