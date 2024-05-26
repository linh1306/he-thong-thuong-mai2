'use client'

import AddToCart from "@/components/cart/addToCart"
import { IProduct } from "@/utils/schemas/Product"
import { Avatar, Button, Col, Descriptions, Flex, Row, Table, TableProps } from "antd"
import Image from "next/image"

interface IItemCart extends IProduct {
  quantityOfCart: number
}

const columns: TableProps<IItemCart>['columns'] = [
  {
    title: 'Mặt hàng',
    key: 'name',
    render: (_, product) => (
      <Flex gap='small' align="center">
        <Avatar size='large' shape="square" icon={<Image src={product.urlImage} alt={product.name} width={100} height={100} />} />
        <p>{product.name}</p>
      </Flex>
    ),
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Số lượng',
    key: 'quantityOfCart',
    render: (_, product) => (
      <AddToCart value={product.quantityOfCart} product={product} styleRow={true} />
    ),
  },
  {
    title: 'Tổng',
    key: 'address',
    dataIndex: 'quantityOfCart',
    render: (_, product) => (
      <p>{product.quantityOfCart * product.price}</p>
    ),
  }
]

export default function PageCard() {
  const cartProducts: IItemCart[] = [
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
      unit: 'cái',
      quantityOfCart: 3
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
      unit: 'cái',
      quantityOfCart: 3
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
      unit: 'cái',
      quantityOfCart: 3
    },
    
  ]
  const totalPrice = cartProducts.reduce((accumulator, product) => {
    return accumulator + (product.price * product.quantityOfCart);
  }, 0);
  const countProducts = cartProducts.reduce((accumulator, product) => {
    return accumulator + product.quantityOfCart;
  }, 0);
  return (
    <Row gutter={12}>
      <Col span={12} >
        <Table columns={columns} dataSource={cartProducts} />
      </Col>
      <Col span={12} >
        <Descriptions title="Thanh toán" items={[
          {
            key: '1',
            span: 3,
            label: 'Số mặt hàng',
            children: cartProducts.length,
          },
          {
            key: '2',
            span: 3,
            label: 'Số sản phẩm',
            children: countProducts,
          },
          {
            key: '3',
            span: 3,
            label: <p className="font-bold">Tổng tiền</p>,
            children: <p className="font-bold text-green-500">{totalPrice.toLocaleString('vi-VN')} đ</p>
          }
        ]} />
        <Button type="primary" className="w-full" >Thanh toán</Button>
      </Col>
    </Row>
  )
}