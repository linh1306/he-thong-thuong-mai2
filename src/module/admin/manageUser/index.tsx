'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IUser } from "@/utils/schemas/User";
import { Button, Flex, Input, Space, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { removeEmptyFields } from "@/utils/fuc";
import { ICategory } from "@/utils/schemas/Category";
import Select, { SelectProps } from "antd/es/select";
import { getCategory } from "@/utils/api/customer/category";
import { getUsers, updateRoleUser } from "@/utils/api/admin/user";

export default function ManageUser() {
  const [user, setUser] = useState<IUser[]>([]);
  const [OptionCategory, setOptionCategory] = useState<SelectProps['options']>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<IUser>({});
  const [reload, setReload] = useState(false)

  const columns: TableProps<IUser>['columns'] = [
    {
      key: 'stt',
      title: 'Số thứ tự',
      render: (_, __, index) => <p>{index + 1}</p>,
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

  useEffect(() => {
    const fetchData = async () => {
      const dataUser = await getUsers();
      setUser(dataUser.data);
      const fetchCateGory = await getCategory();
      const dataCateGory: ICategory[] = fetchCateGory?.data ?? []
      const optionCategory: SelectProps['options'] = dataCateGory.map(category => {
        return { label: category.name, value: (category?._id ?? '').toString() };
      });
      setOptionCategory(optionCategory);
    };
    fetchData();
  }, [reload]);

  return (
    <Flex vertical gap={10}>
      <Table columns={columns} dataSource={user} rowKey="_id" />
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
