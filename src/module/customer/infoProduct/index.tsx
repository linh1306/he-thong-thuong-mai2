'use client'

import AddToCart from "@/components/cart/addToCart"
import { getInfoProduct } from "@/utils/api/customer/product"
import createNotification from "@/utils/fuc/notification"
import { IProduct } from "@/utils/schemas/Product"
import { Col, Descriptions, Flex, Image, Row, Skeleton } from "antd"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageInfoProduct() {
  const route = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<IProduct>({})
  const [isLoading, setIsLoading] = useState(true)
  console.log(params);
  useEffect(() => {
    const fetchData = async () => {
      const { id } = params;
      const res = await getInfoProduct({ _product: id })
      if (res.status === 'success') {
        setProduct(res.data)
      } else {
        createNotification(res.status, res.message)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])
  if (isLoading) {
    return (
      <Row gutter={10}>
        <Col span={12}>
          <Skeleton.Image style={{ width: 500, height: 500 }} active />
        </Col>
        <Col span={12}>
          <Skeleton active />
        </Col>
      </Row>
    )
  }
  return (
    <Row>
      <Col span={12}>
        <Image width={500} src={product?.urlImage ?? ''} alt="image" />
      </Col>
      <Col span={12}>
        <Descriptions title="Thông tin sản phẩm" items={[
          {
            key: '1',
            span: 3,
            label: 'Tên sản phẩm',
            children: product?.name,
          },
          {
            key: '2',
            span: 3,
            label: 'Giới thiệu',
            children: product?.description,
          },
          {
            key: '3',
            span: 3,
            label: 'Số lượng còn lại',
            children: product?.quantity,
          },
        ]} />
        <Flex justify="space-between">
          <Flex gap='small' align="center">
            <p className='text-xl font-semibold text-green-600'>{(Math.max(product?.price! * (100 - product?.percentSale!) / 100, 0)).toLocaleString('vi-VN')}đ</p>
            <p className='line-through'>{product?.price!.toLocaleString('vi-VN')}đ</p>
          </Flex>
          <AddToCart product={product} styleRow={true} />
        </Flex>
      </Col>
    </Row>
  )
}