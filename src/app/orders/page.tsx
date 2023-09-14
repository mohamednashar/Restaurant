import React from 'react'

const OrdersPage = () => {
  return (
    <div className='p-4 lg:px-20 xl:px-40'>
      <table className='w-full border-separate border-spacing-3 '>
        <thead>
          <tr className='text-left text-orange-500'>
            <th className='hidden md:block'>Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className='hidden md:block py-6 px-1'>Products</th>
            <th>Status</th>
          </tr>

        </thead>
        <tbody>
          <tr className='text-sm md:text-base bg-red-50'>
            <td className='hidden md:block py-6 px-1'>123456789</td>
            <td className='py-6 px-1'>9/12/2023</td>
            <td className='py-6 px-1'>99.90</td>
            <td className='hidden md:block py-6 px-1'>Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
            <td className='py-6 px-1 font-bold text-red-500'>On the way (approx. 10min)...</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='hidden md:block py-6 px-1'>123456789</td>
            <td className='py-6 px-1'>9/12/2023</td>
            <td className='py-6 px-1'>99.90</td>
            <td className='hidden md:block py-6 px-1'>Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
            <td className='py-6 px-1 font-bold text-green-600 '>Delivered</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='hidden md:block py-6 px-1'>123456789</td>
            <td className='py-6 px-1'>9/12/2023</td>
            <td className='py-6 px-1'>99.90</td>
            <td className='hidden md:block py-6 px-1'>Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
            <td className='py-6 px-1 font-bold text-green-600'>Delivered</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='hidden md:block py-6 px-1'>123456789</td>
            <td className='py-6 px-1'>9/12/2023</td>
            <td className='py-6 px-1'>99.90</td>
            <td className='hidden md:block py-6 px-1'>Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
            <td className='py-6 px-1 font-bold text-green-600'>Delivered</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className='hidden md:block py-6 px-1'>123456789</td>
            <td className='py-6 px-1'>9/12/2023</td>
            <td className='py-6 px-1'>99.90</td>
            <td className='hidden md:block py-6 px-1'>Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
            <td className='py-6 px-1 font-bold text-green-600'>Delivered</td>
          </tr>

        </tbody>
      </table>
      
    </div>
  )
}

export default OrdersPage