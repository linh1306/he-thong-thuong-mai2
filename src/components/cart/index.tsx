'use client'
import React, { MouseEventHandler } from 'react';
import { IProduct } from '@/utils/schemas/Product';
import Image from 'next/image';
import AddToCart from './addToCart';
import Link from 'next/link';

interface ICartProps {
  product: IProduct;
}

export default function CCart({ product }: ICartProps) {

  const preventDefault: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  return (
    <Link href={''}>
      <div className='w-full text-black h-full p-2 border-[1px] rounded-md hover:shadow-lg'>
        <div onClick={preventDefault} className='cursor-default aspect-square w-full object-cover border-[1px] rounded-md overflow-hidden'>
          <Image className='w-full h-full' src={product.urlImage!} alt={product.name!} width={400} height={400} />
        </div>
        <div className='flex justify-between mt-2 min-h-[96px]'>
          <div className='font-mono flex flex-col justify-center'>
            <p className='font-bold text-lg'>{product.name}</p>
            <p>{product.description}</p>
            <div className='flex gap-2'>
              <p className='line-through'>{product?.price!.toLocaleString('vi-VN')}đ</p>
              <p className='text-base font-semibold text-green-600'>{(Math.max(product.price! * (100 - product.percentSale!) / 100, 0)).toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
          <div className='cursor-default' onClick={preventDefault}>
            <AddToCart value={0} product={product} />
          </div>
        </div>
      </div>
    </Link>
  );
};