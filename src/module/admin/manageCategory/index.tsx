'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCategory } from "@/utils/api/customer/category";
import { ICategory } from "@/utils/schemas/Category";
import { Button, Flex, Input, Space, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/utils/api/admin/category";
import createNotification from "@/utils/fuc/notification";
import { removeEmptyFields } from "@/utils/fuc";

export default function ManageCategory() {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<ICategory>({});
  const [reload, setReload] = useState(false)

  const columns: TableProps<ICategory>['columns'] = [
    {
      key: 'stt',
      title: 'Số thứ tự',
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      key: 'image',
      title: 'Banner',
      render: (_, category) => (
        <div className="w-12 aspect-square overflow-hidden object-cover">
          <Image src={category.urlImage!} alt="banner category" width={400} height={400} />
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: 'action',
      title: 'Hành động',
      render: (_, category) => (
        <Space size="middle">
          <EditOutlined
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
              setTitleModal('Edit');
              setInitValue(category);
              setOpenModal(true);
            }}
          />
          <DeleteOutlined
            className="cursor-pointer hover:text-red-500"
            onClick={() => {
              setTitleModal('Delete');
              setInitValue(category);
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
        case 'Add':
          res = await createCategory(param)
          break;
        case 'Edit':
          res = await updateCategory(removeEmptyFields({ ...param, _id: initValue?._id }))
          break;
        case 'Delete':
          res = await deleteCategory({ _id: initValue?._id! })
          break;
      }
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
      const { data } = await getCategory();
      setCategory(data);
    };
    fetchData();
  }, [reload]);

  return (
    <Flex vertical gap={10}>
      <Flex className="w-full" justify="end">
        <Button
          type="primary"
          onClick={() => {
            setTitleModal('Add');
            setInitValue({ name: '' });
            setOpenModal(true);
          }}
        >
          Add
        </Button>
      </Flex>
      <Table columns={columns} dataSource={category} rowKey="_id" />
      <CModal
        title={titleModal}
        initValue={initValue}
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleSubmit={handleSubmitModal}
        itemsForm={[
          {
            name: 'urlImage',
            label: 'Banner',
            required: true,
            type: ['Add', 'Edit']
          },
          {
            name: 'name',
            label: 'Tên',
            required: true,
            children: <Input />,
            type: ['Add', 'Edit']
          }
        ]}
      />
    </Flex>
  );
}
