'use client'
import React from 'react';
import { Col, Row } from 'antd';
import { IProduct } from '@/utils/schemas/Product';
import CCart from '../cart';

export default function Products({ products, max = 999 }: { products: IProduct[], max?: number }) {


  return (
    <Row gutter={[16, 16]}>
      {
        products.slice(0, max).map((product, index) => (
          <Col key={index}
            xs={{ flex: '100%' }}
            sm={{ flex: '100%' }}
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