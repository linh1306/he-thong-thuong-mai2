'use client';
import CModal from "@/components/modal";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IProduct } from "@/utils/schemas/Product";
import { Button, Flex, Input, Space, Table, TableProps } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { removeEmptyFields } from "@/utils/fuc";
import { createProduct, deleteProduct, updateProduct } from "@/utils/api/admin/product";
import { getProducts } from "@/utils/api/customer/product";
import { ICategory } from "@/utils/schemas/Category";
import Select, { SelectProps } from "antd/es/select";
import { getCategory } from "@/utils/api/customer/category";

export default function ManageProduct() {
  const [product, setProduct] = useState<IProduct[]>([]);
  const [OptionCategory, setOptionCategory] = useState<SelectProps['options']>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Add');
  const [initValue, setInitValue] = useState<IProduct>({});
  const [reload, setReload] = useState(false)

  const columns: TableProps<IProduct>['columns'] = [
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
          <Image src={item.urlImage!} alt="banner Product" width={400} height={400} />
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: 'category',
      title: 'Loại',
      render: (_, item) => {
        const category = item._category as unknown as ICategory
        return <>{category.name}</>
      }
    },
    {
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
    },
    {
      key: 'description',
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      key: 'quantity',
      title: 'Số lượng còn lại',
      dataIndex: 'quantity',
    },
    {
      key: 'percentSale',
      title: 'Giảm giá',
      dataIndex: 'percentSale',
    },
    {
      key: 'numberOfReviews',
      title: 'Reviews',
      dataIndex: 'numberOfReviews',
    },
    {
      key: 'rating',
      title: 'Đánh giá',
      render: (_, item) => <>{item?.sumRating ? item.sumRating / item.numberOfReviews! : '5'}</>
    },
    {
      key: 'action',
      title: 'Hành động',
      render: (_, Product) => (
        <Space size="middle">
          <EditOutlined
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
              setTitleModal('Edit');
              setInitValue(Product);
              setOpenModal(true);
            }}
          />
          <DeleteOutlined
            className="cursor-pointer hover:text-red-500"
            onClick={() => {
              setTitleModal('Delete');
              setInitValue(Product);
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
          res = await createProduct(param)
          break;
        case 'Edit':
          res = await updateProduct(removeEmptyFields({ ...param, _id: initValue?._id }))
          break;
        case 'Delete':
          res = await deleteProduct({ _id: initValue?._id! })
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
      const dataProduct = await getProducts();
      setProduct(dataProduct.data);
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
      <Table columns={columns} dataSource={product} rowKey="_id" />
      <CModal
        title={titleModal}
        initValue={initValue}
        openModal={openModal}
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
            name: '_category',
            label: 'Loại',
            required: true,
            type: ['Add', 'Edit'],
            children: <Select options={OptionCategory} />
          },
          {
            name: 'price',
            label: 'Tên',
            required: true,
            type: ['Add', 'Edit'],
            children: <Input type="number" />
          },
          {
            name: 'percentSale',
            label: 'Giảm giá',
            required: true,
            type: ['Edit'],
            children: <Input type="number" max={100} min={0} />
          },
          {
            name: 'description',
            label: 'Mô tả',
            required: true,
            type: ['Add', 'Edit'],
            children: <Input />
          },
          {
            name: 'urlImage',
            label: 'Banner',
            required: true,
            type: ['Add', 'Edit']
          },
          {
            name: 'unit',
            label: 'Đơn vị',
            required: true,
            type: ['Add', 'Edit'],
            children: <Input />
          },
        ]}
      />
    </Flex>
  );
}
