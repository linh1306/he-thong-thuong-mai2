'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IUser } from "@/utils/schemas/User";
import { Button, Flex, Input, Pagination, Space, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams, removeEmptyFields } from "@/utils/fuc";
import { ICategory } from "@/utils/schemas/Category";
import Select, { SelectProps } from "antd/es/select";
import { getCategory } from "@/utils/api/customer/category";
import { getUsers, updateRoleUser } from "@/utils/api/admin/user";
import Search from "antd/es/input/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ManageUser() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const [user, setUser] = useState<IUser[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [titleModal, setTitleModal] = useState('Add')
  const [initValue, setInitValue] = useState<IUser>({})
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    role: paramsObj.role ?? '',
    searchKey: paramsObj.searchKey ?? '',
    totalDocuments: 0
  })

  const columns: TableProps<IUser>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: 'image',
      title: 'Hình ảnh',
      render: (_, item) => (
        <div className="w-12 aspect-square overflow-hidden object-cover">
          <Image src={item.urlImage!} alt="banner User" width={400} height={400} />
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      render: (_, item) => (
        <>{item.address?.join(',')}</>
      ),
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      key: 'role',
      title: 'Quyền',
      dataIndex: 'role',
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await getUsers(optionPage);
      console.log(res);
      if (res.status === 'success') {
        setOptionPage(prop => ({ ...prop, ...res.options }))
        setUser(res.data)
      }
      setLoading(false)
    };
    fetchData();
  }, [reload]);

  const handleSearch = () => {
    const { pageSize, totalDocuments, ...optionFetch } = optionPage
    const newSearchParam = createSearchParams(path, optionFetch)
    route.push(newSearchParam)
    setOptionPage(prop => ({ ...prop, currentPage: 1 }));
    setReload(prop => !prop)
  }

  const handleChangePagination = (page: number, pageSize: number) => {
    const newRoute = createSearchParams(path, { currentPage: page })
    setOptionPage(prop => ({ ...prop, currentPage: page }));
    route.push(newRoute)
    setReload(prop => !prop)
  }

  const handleSubmitModal = async (param: any) => {
    try {
      let res = null
      switch (titleModal) {
        case 'Edit':
          res = await updateRoleUser(removeEmptyFields({ ...param, _id: initValue?._id }))
          break;
      }
      console.log(param, res);

      if (res.status === 'success') {
        setReload(prop => !prop)
      }
      createNotification(res.status, res.message)
    }
    catch (error) {
      console.error('Failed to submit the form:', error);
    }
  };
  return (
    <Flex vertical gap={10}>
      <Flex className="w-full" justify="space-between">
        <Flex className="w-80" gap={3}>
          <Select
            className="flex-1"
            defaultValue={optionPage.role}
            allowClear
            options={[{ label: 'Quản lý', value: 'admin' }, { label: 'Nhân viên', value: 'employee' }, { label: 'Người dùng', value: 'customer' }]}
            onChange={(value) => { setOptionPage(prop => ({ ...prop, role: value })) }} />
          <Search
            className="flex-1"
            value={optionPage.searchKey}
            placeholder='Tìm kiếm theo tên'
            onChange={(e) => { setOptionPage(prop => ({ ...prop, searchKey: e.target.value })) }}
            onSearch={handleSearch} />
        </Flex>
      </Flex>
      <Table
        loading={loading}
        pagination={false}
        columns={columns}
        dataSource={user} rowKey="_id" />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
      <CModal
        title={titleModal}
        initValue={initValue}
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleSubmit={handleSubmitModal}
        itemsForm={[
          {
            name: 'role',
            label: 'Quyền',
            required: true,
            type: ['Edit'],
            children: <Select options={[
              {
                label: 'Quản lý',
                value: 'admin',
              },
              {
                label: 'Nhân viên',
                value: 'employee',
              },
              {
                label: 'Người dùng',
                value: 'customer',
              }
            ]} />
          }
        ]}
      />
    </Flex>
  );
}