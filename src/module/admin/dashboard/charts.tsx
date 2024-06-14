'use client';
import CModal from "@/components/modal";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getCategory } from "@/utils/api/customer/category";
import { ICategory } from "@/utils/schemas/Category";
import { Badge, Button, Card, Col, Flex, Input, Progress, Row, Select, Space, Statistic, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { IGetReportChartBody, getReportChart } from "@/utils/api/admin/report";
import { getProducts } from "@/utils/api/customer/product";
import { IProduct } from "@/utils/schemas/Product";

interface Option {
  value: string;
  label: string;
}
const colors = [
  "#3e95cd",
  "#ff6f61",
  "#6b5b95",
  "#88b04b",
  "#d65076",
  "#45b8ac",
  "#e94b3c",
  "#009b77",
  "#dd4124",
  "#9b2335",
  "#f7cac9",
  "#92a8d1",
  "#955251",
  "#b565a7",
  "#009b77",
  "#dd4124",
  "#9b2335",
  "#f7cac9",
  "#92a8d1",
  "#955251",
  "#b565a7",
  "#009b77",
  "#dd4124",
  "#9b2335",
  "#f7cac9"
];


export default function Charts({ oderPayed, oderDelivered, oderTotal }: { oderPayed: number, oderDelivered: number, oderTotal: number }) {
  const [report, setReport] = useState([]);
  const [option, setOption] = useState<IGetReportChartBody>({
    _product: [],
    optionReport: 'month'
  });
  const [optionProducts, setOptionProducts] = useState<Option[]>([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReportChart(option)
      console.log('chart', res,option);
      if (res.status === 'success') {
        setReport(res.data)
      }
    }
    fetchData()
  }, [reload])
  useEffect(() => {
    const fetchData = async () => {
      const res = await getProducts({
        currentPage: 1,
        pageSize: 9999
      })
      if (res.status === 'success') {
        const { data }: { data: IProduct[] } = res
        const optionSelectProduct = data.map(product => ({ label: product.name!, value: product.name! }))
        setOptionProducts(optionSelectProduct)
      }
    }
    fetchData()
  }, [])

  return (
    <Row gutter={12}>
      <Col className="rounded-md border-2" span={18}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={report}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {
              option._product.map((item, index) => {
                return (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={item}
                    stroke={colors[index]}
                    activeDot={{ r: 8 }}
                  />
                )
              })
            }
          </LineChart>
        </ResponsiveContainer>
      </Col>
      <Col span={6}>
        <Flex vertical className="p-2 rounded-md border-2" gap={3}>
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={[]}
            style={{ width: '100%' }}
            options={optionProducts}
            onChange={(value) => {
              setOption(prop => ({ ...prop, _product: value }))
            }}
            filterOption={(input, option) => {
              const label = option?.label
              if (label) {
                return (label.toLowerCase().indexOf(input?.toLowerCase()) >= 0)
              }
              return false
            }}
          />
          <Flex gap={3}>
            <Select
              defaultValue="month"
              style={{ width: '70%' }}
              options={[
                { value: 'month', label: 'Tháng' },
                { value: 'precious', label: 'Quý' },
                { value: 'year', label: 'Năm' }
              ]}
              onChange={(value) => {
                setOption(prop => ({ ...prop, optionReport: value }))
              }}
            />
            <Button onClick={() => setReload(prop => !prop)} className="flex-1" type="primary" icon={<p>Ok</p>} />
          </Flex>
        </Flex>
        <Flex className="w-full h-full" justify="center" align="center">
          <Progress size={[200, 20]} type="dashboard" showInfo={false} success={{ percent: oderDelivered / oderTotal * 100 }} percent={(oderDelivered + oderPayed) / oderTotal * 100} />
          <Flex vertical className="absolute">
            <Badge size="small" status="processing" text={"Đã thanh toán:" + oderPayed} />
            <Badge status="success" text={"Đã giao hàng:" + oderDelivered} />
            <Badge status="default" text={"Tổng đơn:" + oderTotal} />
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
}
