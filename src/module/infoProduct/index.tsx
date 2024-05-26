'use client'

import { IProduct } from "@/utils/schemas/Product"
import { Col, Descriptions, Flex, Image, Row } from "antd"
import { useParams } from "next/navigation"
import AddToCart from "../../components/cart/addToCart"

export default function PageInfoProduct() {
  const params = useParams()
  const product: IProduct = {
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
  }
  return (
    <Row>
      <Col span={12}>
        <Image width={500} src={product.urlImage} alt="image" />
      </Col>
      <Col span={12}>
        <Descriptions title="Thông tin sản phẩm" items={[
          {
            key: '1',
            span: 3,
            label: 'Tên sản phẩm',
            children: product.name,
          },
          {
            key: '2',
            span: 3,
            label: 'Giới thiệu',
            children: product.description,
          },
          {
            key: '3',
            span: 3,
            label: 'Số lượng còn lại',
            children: product.quantity,
          },
        ]} />
        <Flex justify="space-between">
          <Flex gap='small' align="center">
            <p className='text-xl font-semibold text-green-600'>{(Math.max(product.price * (100 - product.percentSale) / 100, 0)).toLocaleString('vi-VN')}đ</p>
            <p className='line-through'>{product.price.toLocaleString('vi-VN')}đ</p>
          </Flex>
          <AddToCart value={0} product={product} styleRow={true}/>
        </Flex>
      </Col>
    </Row>
  )
}