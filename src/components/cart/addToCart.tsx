'use client'
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { IProduct } from '@/utils/schemas/Product';
import { useDispatch, useSelector } from 'react-redux';
import { addCartStore } from '@/utils/redux/features/cart/cartSlice';
import { RootState } from '@/utils/redux/store';

interface IAddToCartProps {
  value?: number;
  product: IProduct;
  styleRow?: boolean
}

export default function AddToCart({ value, product, styleRow }: IAddToCartProps) {
  const cartStore = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(value ?? 0)
  useEffect(() => {
    if (value === undefined) {
      cartStore.forEach(itemProductCart => {
        if (itemProductCart._product._id === product._id) {
          setQuantity(itemProductCart.quantity)
          return
        }
      });
    }
  }, [])
  const handleClick = (index: number) => {
    dispatch(addCartStore({ _product: product, quantity: Math.max(quantity + index, 0) }))
    setQuantity(prop => Math.max(prop + index, 0))
  }
  return (
    <div className={`h-full flex ${styleRow ? '' : 'flex-col'} justify-end`}>
      {quantity > 0 && (
        <>
          <Button shape="circle" icon={<p>-</p>} onClick={() => handleClick(-1)} />
          <Button type='text' shape="circle" icon={<p>{quantity}</p>} />
        </>
      )}
      <Button shape="circle" icon={<p>+</p>} onClick={() => handleClick(1)} />
    </div>
  );
};