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
import { IReport } from "@/utils/schemas/Report";
import { IGetReportParams, getReport } from "@/utils/api/admin/report";

const now = new Date();
const firstDayOfMonth = new Date(now.getFullYear() - 3, now.getMonth(), 1);

export default function PageDashboard() {
  const [report, setReport] = useState<IReport>({});
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [optionReport, setOptionReport] = useState({
    start: firstDayOfMonth,
    end: now
  });
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const start = optionReport.start.toString()
      const end = optionReport.end.toString()
      const res = await getReport({ start, end })
      console.log(res, optionReport);

      setReport(res.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Flex vertical gap='middle'>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} className="border-b-2 border-red-500">
            <Statistic
              title="Doanh thu"
              value={report?.revenues}
              valueStyle={{ color: '#3f8600' }}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="border-b-2 border-blue-500">
            <Statistic
              title="Số đơn hàng"
              value={report?.oderTotal}
              valueStyle={{ color: '#cf1322' }}
              suffix="đơn"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="border-b-2 border-green-500">
            <Statistic
              title="Số người mua"
              value={report?.reportUsers?.length}
              valueStyle={{ color: '#cf1322' }}
              suffix="người"
            />
          </Card>
        </Col>
      </Row>
      <Charts oderPayed={report?.oderPayed??0}  oderDelivered={report?.oderDelivered??0} oderTotal={report?.oderTotal??0}/>
    </Flex>
  );
}
