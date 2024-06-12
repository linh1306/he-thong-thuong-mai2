'use client';
import CModal from "@/components/modal";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getCategory } from "@/utils/api/customer/category";
import { ICategory } from "@/utils/schemas/Category";
import { Badge, Button, Card, Col, Flex, Input, Progress, Row, Select, Space, Statistic, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Charts() {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<ICategory>({});
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)

  const data = [
    { name: 'Sunday', Applied: 86, Accepted: 70, Pending: 10 },
    { name: 'Monday', Applied: 114, Accepted: 90, Pending: 21 },
    { name: 'Tuesday', Applied: 106, Accepted: 44, Pending: 60 },
    { name: 'Wednesday', Applied: 106, Accepted: 60, Pending: 44 },
    { name: 'Thursday', Applied: 107, Accepted: 83, Pending: 17 },
    { name: 'Friday', Applied: 111, Accepted: 90, Pending: 21 },
    { name: 'Saturday', Applied: 133, Accepted: 100, Pending: 17 }
  ];

  return (
    <Row gutter={12}>
      <Col className="rounded-md border-2" span={18}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Applied" stroke="#3e95cd" />
            <Line type="monotone" dataKey="Accepted" stroke="#3cba9f" />
            <Line type="monotone" dataKey="Pending" stroke="#ffa500" />
            <Line type="monotone" dataKey="Rejected" stroke="#c45850" />
          </LineChart>
        </ResponsiveContainer>
      </Col>
      <Col span={6}>
        <Flex vertical className="p-2 rounded-md border-2" gap={3}>
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={['all']}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'new', label: 'Mới' },
              { value: 'old', label: 'Cũ' }
            ]}
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
            />
            <Button className="flex-1" type="primary" icon={<p>Ok</p>} />
          </Flex>
        </Flex>
        <Flex className="w-full h-full" justify="center" align="center">
          <Progress size={[200, 20]} type="dashboard" showInfo={false} success={{ percent: 10 }} percent={12} />
          <Flex vertical className="absolute">
            <Badge size="small" status="processing" text={"Đã thanh toán:" + 21} />
            <Badge status="success" text={"Đã giao hàng:" + 43} />
            <Badge status="default" text={"Tổng đơn:" + 1000} />
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
}
