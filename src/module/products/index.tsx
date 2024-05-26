'use client'

import Products from "@/components/products"
import { Affix, Button, Col, Row, Select, Slider, TreeSelect, Typography } from "antd"

export default function PageProducts() {
  return (
    <Row gutter={8} className="flex flex-nowrap">
      <Col flex='200px' className="relative">
        <div className="sticky top-4">
          <div className="relative rounded-md bg-slate-200 h-[90vh] p-3 flex  flex-col gap-3">
            <Typography.Title level={5}>Bộ lọc</Typography.Title>
            <div>
              <Typography.Text >Loại</Typography.Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Chọn loại mặt hàng"
                defaultValue={[]}
                onChange={() => { }}
                options={[
                  {
                    label: 'Loại sản phẩm 1',
                    value: 'Loại sản phẩm 1'
                  },
                  {
                    label: 'Loại sản phẩm 2',
                    value: 'Loại sản phẩm 2'
                  },
                  {
                    label: 'Loại sản phẩm 3',
                    value: 'Loại sản phẩm 3'
                  },
                ]}
              />
            </div>
            <div>
              <Typography.Text >Giá</Typography.Text>
              <Slider range defaultValue={[0, 3000]} max={3000} step={100} />
            </div>
            <div>
              <Typography.Text >Sắp xếp theo</Typography.Text>
              <TreeSelect
                treeDataSimpleMode
                style={{ width: '100%' }}
                // value={''}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                onChange={() => { }}
                treeData={[
                  {
                    id: 1,
                    pId: 0,
                    value: 'new',
                    title: 'Mới nhất',
                  },
                  {
                    id: 2,
                    pId: 0,
                    value: 'sale',
                    title: 'Bán chạy',
                  },
                  {
                    id: 3,
                    pId: 0,
                    value: 'price',
                    title: 'Giá bán',
                    disabled: true,
                  },
                  {
                    id: 4,
                    pId: 3,
                    value: 'priceIncrease',
                    title: 'Tăng dần',
                  },
                  {
                    id: 5,
                    pId: 3,
                    value: 'priceReduce',
                    title: 'Giảm dần',
                  },

                ]}
              />
            </div>
            <Button type="primary">Lọc</Button>
          </div>
        </div>
      </Col>
      <Col flex='auto' className="">
        <Products />
        <Products />
      </Col>
    </Row>
  )
}