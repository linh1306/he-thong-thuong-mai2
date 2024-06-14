'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCategory } from "@/utils/api/customer/category";
import { ICategory } from "@/utils/schemas/Category";
import { Button, Col, Descriptions, Flex, Input, Modal, Pagination, Row, Space, Table, TableProps, Tag } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/utils/api/admin/category";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams, removeEmptyFields, timeToString } from "@/utils/fuc";
import { IInvoiceSale } from "@/utils/schemas/InvoiceSale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getInvoiceSalesMe } from "@/utils/api/customer/invoiceSale";
import { IProductInvoice } from "@/utils/schemas/ProductInvoice";
import { IProduct } from "@/utils/schemas/Product";

const statusInvoice = {
  'confirmed': 'cyan',
  'payed': 'blue',
  'success': 'green',
  'cancelled': 'red'
}

interface IProductInvoiceRes extends IProductInvoice {
  productDetails?: IProduct
}

interface IInvoiceSaleRes extends IInvoiceSale {
  products?: IProductInvoiceRes[]
}

export default function InvoiceSaleMe() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const [invoiceSale, setInvoiceSale] = useState<IInvoiceSaleRes[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<IInvoiceSaleRes>({});
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    totalDocuments: 0
  })
  const [loading, setLoading] = useState(false)

  const columnsProduct: TableProps<IProductInvoiceRes>['columns'] = [
    {
      key: 'stt',
      title: <p>{(initValue?.products ?? []).length}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: '_product.urlImage',
      title: 'Hình ảnh',
      render: (_, { productDetails }) => (
        <div className="w-12 aspect-square overflow-hidden object-cover">
          <Image src={productDetails?.urlImage!} alt="banner Product" width={200} height={200} />
        </div>
      ),
    },
    {
      key: '_product.name',
      title: 'Tên',
      render: (_, { productDetails }) => <p>{productDetails?.name}</p>,
    },
    {
      key: 'price',
      title: 'Giá',
      align: 'end',
      render: (_, invoiceSale) => <p>{invoiceSale?.price?.toLocaleString('vi-VN')}đ</p>,
    },
    {
      key: 'quantity',
      title: 'Số lượng',
      dataIndex: 'quantity'
    }
  ];
  const columns: TableProps<IInvoiceSale>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: 'code',
      title: 'Mã thanh toán',
      dataIndex: 'code'
    },
    {
      key: 'total',
      title: 'Tổng tiền',
      align: 'end',
      render: (_, invoiceSale) => <p>{invoiceSale?.total?.toLocaleString('vi-VN')}đ</p>,
    },
    {
      key: 'create_at',
      title: 'Ngày mua',
      render: (_, invoiceSale) => <p>{timeToString(invoiceSale.create_at!)}</p>,
    },
    {
      key: 'status',
      title: 'trạng thái',
      render: (_, invoiceSale) => <Tag color={statusInvoice[invoiceSale.statusInvoice!]} >{invoiceSale.statusInvoice!}</Tag>,
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dataInvoiceSalse = await getInvoiceSalesMe(optionPage)
      console.log(dataInvoiceSalse);
      setOptionPage(prop => ({ ...prop, ...dataInvoiceSalse.options }))
      setInvoiceSale(dataInvoiceSalse.data)
      setLoading(false)
    };
    fetchData();
  }, [reload]);

  const handleChangePagination = (page: number) => {
    const newRoute = createSearchParams(path, { currentPage: page })
    setOptionPage(prop => ({ ...prop, currentPage: page }));
    route.push(newRoute)
    setReload(prop => !prop)
  }

  return (
    <Flex vertical gap={10}>
      <Button onClick={() => setReload(prop => !prop)}>Load</Button>
      <Table
        loading={loading}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              setInitValue(record)
              setOpenModal(true)
            },
          }
        }}
        columns={columns}
        dataSource={invoiceSale}
        rowKey="_id"
        pagination={false}
      />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
      <Modal open={openModal} onCancel={() => setOpenModal(false)} width={900} title='Hóa đơn' footer={<></>}>
        <Row gutter={12}>
          <Col span={12}>
            <Descriptions items={[
              {
                key: '1',
                span: 3,
                label: 'Mã thanh toán',
                children: initValue.code,
              },
              {
                key: '2',
                span: 3,
                label: 'Địa chỉ giao hàng',
                children: <p>{initValue.address?.join(', ')}</p>,
              },
              {
                key: '3',
                span: 3,
                label: <p className="font-bold">Tổng tiền</p>,
                children: <p className="font-bold text-green-500">{(initValue.total ?? 0).toLocaleString('vi-VN')} đ</p>
              },
              {
                key: '4',
                span: 3,
                children: <Table className="w-full" columns={columnsProduct} dataSource={initValue?.products} pagination={false} />
              },
            ]} />
          </Col>
          <Col span={12}>
            <Image src={`https://img.vietqr.io/image/VBA-1500206139509-qr_only.png?amount=${initValue?.total}&addInfo=${initValue?.code}`} alt="qr banking" width={400} height={400} />
          </Col>
        </Row>
      </Modal>
    </Flex>
  );
}
