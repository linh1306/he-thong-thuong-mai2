'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { IInvoicePurchase } from "@/utils/schemas/InvoicePurchase";
import { Button, Cascader, DatePicker, Flex, Form, Input, Pagination, Select, Space, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams, timeToString } from "@/utils/fuc";
import { IPostInvoicePurchaseBody, createInvoicePurchase, getInvoicePurchases } from "@/utils/api/employee/invoicePurchase";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dataAddress from "@/utils/data/dataAddress";
import { IProduct } from "@/utils/schemas/Product";
import { ISupplier } from "@/utils/schemas/Supplier";
import { getProducts } from "@/utils/api/customer/product";
import { getSuppliers } from "@/utils/api/admin/supplier";

interface Option {
  value: object;
  label: string;
}

interface IInitValueForm {
  _products: object[],
  _supplier: object
}

const initForm = {
  _products: [],
  _supplier: {}
}

export default function ImportProducts() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const [invoicePurchase, setInvoicePurchase] = useState<IInvoicePurchase[]>([]);
  const [optionProducts, setOptionProducts] = useState<Option[]>([]);
  const [optionSuppliers, setOptionSuppliers] = useState<Option[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<IInitValueForm>(initForm);
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    totalDocuments: 0
  })
  const [loading, setLoading] = useState(false)

  const columns: TableProps<IInvoicePurchase>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: '_supplier',
      title: 'Nhà cung cấp',
      render: (_, invoicePurchase) => {
        const _supplier = invoicePurchase?._supplier as ISupplier
        return <p>{_supplier.name}</p>
      },
    },
    {
      key: 'total',
      title: 'Tổng tiền',
      align: 'end',
      render: (_, invoicePurchase) => <p>{invoicePurchase?.total?.toLocaleString('vi-VN')}đ</p>,
    },
    {
      key: 'create_at',
      title: 'ngày nhập',
      render: (_, invoicePurchase) => <p>{timeToString(invoicePurchase.create_at!)}</p>,
    }
  ];

  const handleSubmitModal = async (param: any) => {
    const convertedValues = {
      ...param,
      _products: param._products.map((product: any) => ({
        ...product,
        quantity: parseInt(product.quantity, 10),
        price: parseFloat(product.price),
      }))
    };

    try {
      let res = null
      switch (titleModal) {
        case 'Add':
          res = await createInvoicePurchase(convertedValues)
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
  //get danh sach mat hang, nha cung cap
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dataProducts = await getProducts({ currentPage: 1, pageSize: 1000 })
      const dataSuppliers = await getSuppliers({ currentPage: 1, pageSize: 1000 })

      setOptionProducts(dataProducts.data.map((product: IProduct) => ({ value: product._id, label: product.name })))
      setOptionSuppliers(dataSuppliers.data.map((supplier: ISupplier) => ({ value: supplier._id, label: supplier.name })))
      setLoading(false)
    };
    fetchData();
  }, []);
  //get danh sach hoa don nhap hang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dataInvoicePurchase = await getInvoicePurchases(optionPage)
      console.log(dataInvoicePurchase);
      setOptionPage(prop => ({ ...prop, ...dataInvoicePurchase.options }))
      setInvoicePurchase(dataInvoicePurchase.data)
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
            setInitValue(initForm);
            setOpenModal(true);
          }}
        >
          Add
        </Button>
      </Flex>
      <Table loading={loading} columns={columns} dataSource={invoicePurchase} rowKey="_id" pagination={false} />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
      <CModal
        title={titleModal}
        openModal={openModal}
        initValue={initValue}
        setOpenModal={setOpenModal}
        handleSubmit={handleSubmitModal}
        itemsForm={[
          {
            name: '_products',
            label: 'Mặt hàng',
            required: true,
            type: ['Add'],
            children: <Form.List name="_products">
              {(fields, { add, remove }) => (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3">Sản phẩm</th>
                        <th scope="col" className="py-3">Số lượng</th>
                        <th scope="col" className="py-3">Giá nhập</th>
                        <th scope="col" className="py-3">Hạn sử dụng</th>
                        <th scope="col" className="py-3">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      {fields.map((field) => (
                        <tr key={field.key} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                          <td className='w-44'>
                            <Form.Item className='m-0' name={[field.name, '_id']}>
                              <Select className='w-full' options={optionProducts} onChange={(value) => console.log(value)} />
                            </Form.Item>
                          </td>
                          <td className='w-30'>
                            <Form.Item className='m-0' name={[field.name, 'quantity']}>
                              <Input className='w-full' type='number' />
                            </Form.Item>
                          </td>
                          <td className='w-30'>
                            <Form.Item className='m-0' name={[field.name, 'price']}>
                              <Input className='w-full' type='number' />
                            </Form.Item>
                          </td>
                          <td className='w-30'>
                            <Form.Item className='m-0' name={[field.name, 'exp_at']}>
                              <DatePicker />
                            </Form.Item>
                          </td>
                          <td className='flex'>
                            <Form.Item className='m-0'>
                              <CloseOutlined onClick={() => { remove(field.name) }} />
                            </Form.Item>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Button type="dashed" onClick={() => add({})} block>
                    + Add Item
                  </Button>
                </div>
              )}
            </Form.List>
          },
          {
            name: '_supplier',
            label: 'Nhà cung cấp',
            required: true,
            type: ['Add'],
            children: <Select
              showSearch
              className="ant-select-open"
              options={optionSuppliers}
            />
          },
        ]}
      />
    </Flex>
  );
}
