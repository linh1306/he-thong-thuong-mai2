'use client'

import AddToCart from "@/components/cart/addToCart"
import CCascaderAddress from "@/components/cascaderAddress"
import { createInvoiceSale } from "@/utils/api/customer/invoiceSale"
import dataAddress from "@/utils/data/dataAddress"
import { RootState } from "@/utils/redux/store"
import { IItemCart } from "@/utils/schemas/Cart"
import { IInvoiceSale } from "@/utils/schemas/InvoiceSale"
import { Avatar, Button, Cascader, Col, Descriptions, Flex, Input, Modal, Row, Table, TableProps } from "antd"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const columns: TableProps<IItemCart>['columns'] = [
  {
    title: 'Mặt hàng',
    key: 'name',
    render: (_, item) => (
      <Flex gap='small' align="center">
        <Avatar size='large' shape="square" icon={<Image src={item._product?.urlImage ?? ''} alt={item._product.name ?? ''} width={100} height={100} />} />
        <p>{item._product.name}</p>
      </Flex>
    ),
  },
  {
    title: 'Giá',
    key: 'price',
    render: (_, item) => (
      <p>{item._product.price}</p>
    ),
  },
  {
    title: 'Số lượng',
    key: 'quantityOfCart',
    render: (_, item) => (
      <AddToCart value={item.quantity} product={item._product} styleRow={true} />
    ),
  },
  {
    title: 'Tổng',
    key: 'address',
    dataIndex: 'quantityOfCart',
    render: (_, item) => (
      <p>{item.quantity * item._product.price!}</p>
    ),
  }
]

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = dataAddress

export default function PageCard() {
  const cartStore = useSelector((state: RootState) => state.cart)
  const userStore = useSelector((state: RootState) => state.user)

  const [invoiceSale, setInvoiceSale] = useState<IInvoiceSale>({})
  const [address, setAddress] = useState<string[]>([])
  const [detailedAddress, setDetailedAddress] = useState<string>('')
  const [discount, setDiscount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const totalPrice = cartStore.reduce((accumulator, item) => accumulator + (item._product.price! * item.quantity), 0);
  const countProducts = cartStore.reduce((accumulator, item) => accumulator + item.quantity, 0);

  console.log(userStore, address, detailedAddress);
  const handlePay = async () => {
    setIsLoading(true)
    const res = await createInvoiceSale({ codeDiscount: discount, address: [...address, detailedAddress], _products: cartStore })
    if (res.status === 'success') {
      setInvoiceSale(res.data)
      setOpen(true)
    }
    console.log(res);
    setIsLoading(false)
  }

  useEffect(() => {
    if (Object.entries(userStore).length) {
      const newAddress = (userStore?.address ?? []).slice(0, 3)
      setAddress(newAddress)
      setDetailedAddress((userStore?.address ?? [])[3] ?? '')
    }
  }, [userStore])

  return (
    <Row gutter={12}>
      <Col span={12} >
        <Table columns={columns} dataSource={cartStore} pagination={false} />
      </Col>
      <Col span={12} >
        <Descriptions title="Thanh toán" items={[
          {
            key: '1',
            span: 3,
            label: 'Số mặt hàng',
            children: cartStore.length,
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
        <p>Địa chỉ giao hàng:</p>
        <Flex gap={3}>
          <Cascader
            showSearch
            value={address}
            className="ant-select-open"
            options={options}
            onChange={(value) => setAddress(value)}
          />
          <Input value={detailedAddress} onChange={(e) => setDetailedAddress(e.target.value)} />
        </Flex>
        <p>Mã giảm giá:</p>
        <Flex>
          <Input value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </Flex>
        <Button loading={isLoading} type="primary" className="w-full mt-5" onClick={handlePay}>Thanh toán</Button>
      </Col>
      <Modal open={open} onCancel={() => setOpen(false)} width={800} title='Hóa đơn' footer={<></>}>
        <Row gutter={12}>
          <Col span={12}>
            <Descriptions items={[
              {
                key: '1',
                span: 3,
                label: 'Số mặt hàng',
                children: cartStore.length,
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
          </Col>
          <Col span={12}>
            <Image src={`https://img.vietqr.io/image/VBA-1500206139509-qr_only.png?amount=${invoiceSale.total}&addInfo=${invoiceSale.code}`} alt="qr banking" width={400} height={400} />
          </Col>
        </Row>
      </Modal>
    </Row>
  )
}