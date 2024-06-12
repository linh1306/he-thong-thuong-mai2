'use client';
import CModal from "@/components/modal";
import { SearchOutlined } from '@ant-design/icons';
import { IProductWarehouse } from "@/utils/schemas/ProductWarehouse";
import { Button, Flex, Pagination, Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams, timeToString } from "@/utils/fuc";
import { createProductWarehouse, getProductWarehouses } from "@/utils/api/employee/productWarehouse";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IProduct } from "@/utils/schemas/Product";
import { getProducts } from "@/utils/api/customer/product";
import Image from "next/image";

interface Option {
  value: object;
  label: string;
}

export default function ManageProductWarehouse() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const [productWarehouse, setProductWarehouse] = useState<IProductWarehouse[]>([]);
  const [optionProducts, setOptionProducts] = useState<Option[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState('Delete');
  const [initValue, setInitValue] = useState({});
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    _product: paramsObj._product,
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    totalDocuments: 0
  })
  const [loading, setLoading] = useState(false)

  const columns: TableProps<IProductWarehouse>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: '_product.urlImage',
      title: 'Hình ảnh',
      render: ((_, productWarehouse) => {

        const product = productWarehouse._product as IProduct;
        return (
          <div className="w-12 aspect-square overflow-hidden object-cover">
            <Image src={product?.urlImage!} alt="banner Product" width={200} height={200} />
          </div>
        )
      })
      ,
    },
    {
      key: '_product',
      title: 'Mặt hàng',

      render: (_, productWarehouse) => {
        const product = productWarehouse._product as IProduct;
        return (<p>{product.name}</p>)
      },
    },
    {
      key: 'quantity',
      title: 'Số lượng còn lại',
      dataIndex: 'quantity'
    },
    {
      key: 'importPrice',
      title: 'Giá nhập',
      render: (_, productWarehouse) => <p>{productWarehouse?.importPrice?.toLocaleString('vi-VN')}</p>,

    },
    {
      key: 'create_at',
      title: 'ngày nhập',
      render: (_, productWarehouse) => <p>{timeToString(productWarehouse.create_at!)}</p>,
    },
    {
      key: 'exp_at',
      title: 'ngày hết hạn',
      render: (_, productWarehouse) => <p>{timeToString(productWarehouse.exp_at!)}</p>,
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
          res = await createProductWarehouse(convertedValues)
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

      setOptionProducts(dataProducts.data.map((product: IProduct) => ({ value: product._id, label: product.name })))
      setLoading(false)
    };
    fetchData();
  }, []);
  //get danh sach hoa don nhap hang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dataProductWarehouse = await getProductWarehouses(optionPage)
      console.log(dataProductWarehouse);
      setOptionPage(prop => ({ ...prop, ...dataProductWarehouse.options }))
      setProductWarehouse(dataProductWarehouse.data)
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

  const handleSearch = () => {
    const { pageSize, totalDocuments, ...optionFetch } = optionPage
    const newSearchParam = createSearchParams(path, optionFetch)
    route.push(newSearchParam)
    setOptionPage(prop => ({ ...prop, currentPage: 1 }))
    setReload(prop => !prop)
  }

  return (
    <Flex vertical gap={10}>
      <Flex className="w-full" gap={5}>
        <Select
          className="w-40"
          defaultValue={optionPage._product}
          allowClear
          options={optionProducts}
          onChange={(value) => { setOptionPage(prop => ({ ...prop, _product: value })) }} />
        <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={handleSearch} />
      </Flex>

      <Table loading={loading} columns={columns} dataSource={productWarehouse} rowKey="_id" pagination={false} />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
      <CModal
        title={titleModal}
        openModal={openModal}
        initValue={initValue}
        setOpenModal={setOpenModal}
        handleSubmit={handleSubmitModal}
        itemsForm={[]}
      />
    </Flex>
  );
}
