'use client'
import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { IProduct } from '@/utils/schemas/Product';
import CCart from '../cart';

export default function Products() {

  const products: IProduct[] = [
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
    {
      name: 'Rau củ',
      price: 12000,
      unitsInStock: 3,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái'
    },
  ]

  return (
    <Row gutter={[16, 16]}>
      {
        products.map((product, index) => (
          <Col key={index}
            xs={{ flex: '100%' }}
            sm={{ flex: '50%' }}
            lg={{ flex: '33%' }}
            xl={{ flex: '25%' }}
            className="gutter-row">
            <CCart product={product} />
          </Col>
        ))
      }

    </Row>
  );
};