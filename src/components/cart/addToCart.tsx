'use client'
import React, { useState } from 'react';
import { Button } from 'antd';
import { IProduct } from '@/utils/schemas/Product';

interface IAddToCartProps {
  value: number;
  product:IProduct;
  styleRow?:boolean
}

export default function AddToCart({ value, styleRow }: IAddToCartProps) {
  const [quantity, setQuantity] = useState(value)
  const handleClick = (index: number) => {
    setQuantity(prop => Math.max(prop + index, 0))
  }
  return (
    <div className={`h-full flex ${styleRow?'':'flex-col'} justify-end`}>
      {quantity !== 0 && (
        <>
          <Button shape="circle" icon={<p>-</p>} onClick={() => handleClick(-1)} />
          <Button type='text' shape="circle" icon={<p>{quantity}</p>} />
        </>
      )}
      <Button shape="circle" icon={<p>+</p>} onClick={() => handleClick(1)} />
    </div>
  );
};