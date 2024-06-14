'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IProduct } from "@/utils/schemas/Product";
import { Button, Col, Flex, Form, Input, InputNumber, Modal, Pagination, Row, Space, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createSearchParams, removeEmptyFields } from "@/utils/fuc";
import { createProduct, deleteProduct, updateProduct } from "@/utils/api/admin/product";
import { getProducts } from "@/utils/api/customer/product";
import { ICategory } from "@/utils/schemas/Category";
import Select, { SelectProps } from "antd/es/select";
import { getCategory } from "@/utils/api/customer/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "antd/es/input/Search";
import { IUser } from "@/utils/schemas/User";
import { getReportTable } from "@/utils/api/admin/report";
import { createDiscount } from "@/utils/api/admin/discount";
import TextArea from "antd/es/input/TextArea";
import { createNotificationfromUser } from "@/utils/api/admin/notification";
import createNotification from "@/utils/fuc/notification";

interface IUserReport {
  _user: string,
  revenue: number
  user: IUser[]
}
interface IProductReport {
  _product: string,
  quantity: number
  product: IProduct[]
}

interface ResReportTable {
  reportProducts?: IProductReport[],
  reportUsers?: IUserReport[],
}

const columnsUser: TableProps<IUserReport>['columns'] = [
  {
    title: 'Stt',
    key: 'stt',
    render: (_, __, index) => <p>{index + 1}</p>,
  },
  {
    title: 'Tên',
    key: 'name',
    render: (_, { user }, index) => <p>{user[0]?.name}</p>,
  },
  {
    title: 'Doanh thu từ khách hàng',
    dataIndex: 'revenue',
    key: 'revenue',
  }
];
const columnsProduct: TableProps<IProductReport>['columns'] = [
  {
    title: 'Stt',
    key: 'stt',
    render: (_, __, index) => <p>{index + 1}</p>,
  },
  {
    title: 'Hình ảnh',
    key: 'image',
    render: (_, { product }) => (
      <div className="w-12 aspect-square overflow-hidden object-cover">
        <Image src={product[0].urlImage!} alt="banner category" width={400} height={400} />
      </div>
    ),
  },
  {
    title: 'Sản phẩm',
    key: 'name',
    render: (_, { product }, index) => <p>{product[0]?.name}</p>,
  },
  {
    title: 'Giảm giá hiện tại',
    key: 'sale',
    render: (_, { product }, index) => <p>{product[0]?.percentSale}%</p>,
  },
  {
    title: 'Số lượng bán ra',
    dataIndex: 'quantity',
    key: 'quantity',
  }
];

const now = new Date();
const firstDayOfMonth = new Date(now.getFullYear() - 3, now.getMonth(), 1);

export default function ManageFast() {
  const [report, setReport] = useState<ResReportTable>({});
  const [reload, setReload] = useState(false)
  const [optionReport, setOptionReport] = useState({
    start: firstDayOfMonth,
    end: now
  });
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const start = optionReport.start.toString()
      const end = optionReport.end.toString()
      const res = await getReportTable({ start, end })
      console.log(res);

      if (res.status === 'success') {
        setReport(res.data)
      }
      setLoading(false)
    };
    fetchData();
  }, [reload]);

  const ModalUserAddDiscount = ({ user }: IUserReport) => {
    Modal.info({
      title: 'Tặng voucher',
      content: (
        <Form onFinish={async (values) => {
          const resDiscount = await createDiscount(values)
          const resNotification = await createNotificationfromUser({ _user: user[0]._id, ...values })
          if (resDiscount.status === 'success' && resNotification.status === 'success') {
            createNotification('success', 'Tặng thành công')
          }
        }}>
          <Form.Item label="Mã giảm giá" name='code'>
            <Input />
          </Form.Item>
          <Form.Item label="Tên phiếu giảm giá" name='name'>
            <Input />
          </Form.Item>
          <Form.Item label="Giá trị giảm" name='value' >
            <InputNumber />
          </Form.Item>
          <Form.Item label="Số lượng" name='quantity'>
            <InputNumber />
          </Form.Item>
          <Form.Item label="Tin nhắn đến người dùng" name='description'>
            <TextArea rows={4} />
          </Form.Item>
          <Flex justify="end">
            <Button type="primary" htmlType="submit">Ok</Button>
          </Flex>
        </Form>
      ),
      footer: null,
      maskClosable: true
    });
  }

  const ModalSaleProduct = ({ product }: IProductReport) => {
    Modal.info({
      title: 'Tạo đợt giảm giá sản phẩm',
      content: (
        <Form onFinish={async (values) => {
          const res = await updateProduct({ _id: product[0]._id, ...values })
          if (res.status === 'success') {
            createNotification('success', 'Cập nhật thành công')
            setReload(prop => !prop)
          }
        }}>
          <Form.Item label="Giảm giá" name='percentSale'>
            <Input />
          </Form.Item>
          <Flex justify="end">
            <Button type="primary" htmlType="submit">Ok</Button>
          </Flex>
        </Form>
      ),
      footer: null,
      maskClosable: true
    });
  }

  return (
    <>
      <Flex vertical gap={10}>
        <Table onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              ModalUserAddDiscount(record)
            },
          }
        }} title={() => 'Danh sách khách hàng thân thiết'} bordered columns={columnsUser} dataSource={report.reportUsers} pagination={false} />
        <Table onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              ModalSaleProduct(record)
            },
          }
        }} title={() => 'Danh sách mặt hàng được mua nhiều nhất'} bordered columns={columnsProduct} dataSource={report.reportProducts} pagination={false} />
      </Flex>
    </>
  );
}
