'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ISupplier } from "@/utils/schemas/Supplier";
import { Button, Cascader, Flex, Input, Pagination, Space, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams } from "@/utils/fuc";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "@/utils/api/admin/supplier";
import Select, { SelectProps } from "antd/es/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "antd/es/input/Search";
import dataAddress from "@/utils/data/dataAddress";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

interface IInitValueForm extends ISupplier {
  specificAddress?: string
}

const options: Option[] = dataAddress

const initForm = {
  name: '',
  phone: '',
  address: [],
  specificAddress: ''
}

export default function ManageSupplier() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const [Supplier, setSupplier] = useState<ISupplier[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<IInitValueForm>({});
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    searchKey: paramsObj.searchKey ?? '',
    totalDocuments: 0
  })
  const [loading, setLoading] = useState(false)

  const columns: TableProps<ISupplier>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      render: (_, supplier) => <p>{supplier.address?.join(',')}</p>,
    },
    {
      key: 'action',
      title: 'Hành động',
      render: (_, supplier) => (
        <Space size="middle">
          <EditOutlined
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
              setTitleModal('Edit');
              const newInitValue = supplier
              const specificAddress = newInitValue?.address?.pop()
              setInitValue({ ...newInitValue, specificAddress: specificAddress ?? '' });
              setOpenModal(true);
            }}
          />
          <DeleteOutlined
            className="cursor-pointer hover:text-red-500"
            onClick={() => {
              setTitleModal('Delete');
              setInitValue(supplier);
              setOpenModal(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSubmitModal = async (param: any) => {
    const { specificAddress, ...supplier } = param
    supplier.address.push(specificAddress)
    try {
      let res = null
      switch (titleModal) {
        case 'Add':
          res = await createSupplier(supplier)
          break;
        case 'Edit':
          res = await updateSupplier({ ...supplier, _id: initValue?._id })
          break;
        case 'Delete':
          res = await deleteSupplier({ _id: initValue?._id! })
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dataSupplier = await getSuppliers(optionPage)
      console.log(dataSupplier);
      setOptionPage(prop => ({ ...prop, ...dataSupplier.options }))
      setSupplier(dataSupplier.data)
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
      <Table loading={loading} columns={columns} dataSource={Supplier} rowKey="_id" pagination={false} />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
      <CModal
        title={titleModal}
        openModal={openModal}
        initValue={initValue}
        setOpenModal={setOpenModal}
        handleSubmit={handleSubmitModal}
        itemsForm={[
          {
            name: 'name',
            label: 'Tên',
            required: true,
            type: ['Add', 'Edit'],
            children: <Input />
          },
          {
            name: 'phone',
            label: 'Số điện thoại',
            required: true,
            type: ['Add', 'Edit'],
            children: <Input />
          },
          {
            name: 'address',
            label: 'Địa chỉ',
            required: true,
            type: ['Add', 'Edit'],
            children: <Cascader
              showSearch
              className="ant-select-open"
              options={options}
            />
          },
          {
            name: 'specificAddress',
            label: 'Địa chỉ cụ thể',
            required: true,
            type: ['Add', 'Edit'],
            children: <Input />
          },
        ]}
      />
    </Flex>
  );
}
