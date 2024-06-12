'use client';
import CModal from "@/components/modal";
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Cascader, DatePicker, Flex, Form, Input, Pagination, Select, Space, Table, TableProps, Tag } from "antd";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams, removeEmptyFields, timeToString } from "@/utils/fuc"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IProduct } from "@/utils/schemas/Product";
import { ISupplier } from "@/utils/schemas/Supplier";
import { getProducts } from "@/utils/api/customer/product";
import { getSuppliers } from "@/utils/api/admin/supplier";
import { IInvoiceSale } from "@/utils/schemas/InvoiceSale";
import { IUser } from "@/utils/schemas/User";
import { getInvoiceSales, updateStatusInvoiceSale } from "@/utils/api/employee/invoiceSale";

interface Option {
  value: object;
  label: string;
}

const statusInvoiceSale = [
  {
    value: 'confirmed',
    label: 'Đã xác nhận'
  },
  {
    value: 'payed',
    label: 'Đã thanh toán'
  },
  {
    value: 'success',
    label: 'Đã giao'
  },
  {
    value: 'cancelled',
    label: 'Đã hủy'
  }
]

const statusInvoice = {
  'confirmed': 'cyan',
  'payed': 'blue',
  'success': 'green',
  'cancelled': 'red'
}

export default function ExportProducts() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const [invoiceSale, setInvoiceSale] = useState<IInvoiceSale[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<IInvoiceSale>({});
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    totalDocuments: 0
  })
  const [loading, setLoading] = useState(false)

  const columns: TableProps<IInvoiceSale>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: '_user',
      title: 'Khách hàng',
      render: (_, { _user }) => {
        const user = _user as IUser;
        return <p>{user.name}</p>
      },
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
    },
    {
      key: 'action',
      title: 'Hành động',
      render: (_, item) => (
        <Space size="middle">
          <EditOutlined
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
              setTitleModal('Edit');
              setInitValue(item);
              setOpenModal(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSubmitModal = async (param: any) => {
    console.log({ ...param, _id: initValue?._id });
    try {
      let res = null
      switch (titleModal) {
        case 'Edit':
          res = await updateStatusInvoiceSale(removeEmptyFields({ ...param, _id: initValue?._id }))
          break;
      }
      if (res.status === 'success') {
        setInitValue(res.data)
        setOpenModal(false)
        setReload(prop => !prop)
      }
      createNotification(res.status, res.message)
    }
    catch (error) {
      console.error('Failed to submit the form:', error);
    }
  };

  //get danh sach hoa don nhap hang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dataInvoiceSalse = await getInvoiceSales(optionPage)
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
      <Flex className="w-full" justify="end">
        <Button
          type="primary"
          onClick={() => {
            setTitleModal('Add');
            setInitValue({});
            setOpenModal(true);
          }}
        >
          Add
        </Button>
      </Flex>
      <Table loading={loading} columns={columns} dataSource={invoiceSale} rowKey="_id" pagination={false} />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
      <CModal
        title={titleModal}
        openModal={openModal}
        initValue={initValue}
        setOpenModal={setOpenModal}
        handleSubmit={handleSubmitModal}
        itemsForm={[
          {
            name: 'statusInvoice',
            label: 'Trạng thái',
            required: true,
            type: ['Edit'],
            children: <Select
              showSearch
              className="ant-select-open"
              options={statusInvoiceSale}
            />
          },
        ]}
      />
    </Flex>
  );
}
