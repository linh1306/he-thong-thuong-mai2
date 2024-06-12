'use client';
import CModal from "@/components/modal";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getCategory } from "@/utils/api/customer/category";
import { ICategory } from "@/utils/schemas/Category";
import { Button, Card, Col, Flex, Input, Row, Space, Statistic, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/utils/api/admin/category";
import createNotification from "@/utils/fuc/notification";
import { removeEmptyFields } from "@/utils/fuc";
import Charts from "./charts";
import ReportUserAndProducts from "./ReportUserAndProducts";

export default function PageDashboard() {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<ICategory>({});
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)


  return (
    <Flex vertical gap='middle'>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} className="border-b-2 border-red-500">
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      <Charts />
      <ReportUserAndProducts />
    </Flex>
  );
}
