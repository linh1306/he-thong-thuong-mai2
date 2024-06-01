'use client'
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import Products from "@/components/products";
import { IProduct } from "@/utils/schemas/Product";
import { useEffect, useState } from "react";
import { getProducts } from "@/utils/api/customer/product";

interface IProductTab {
  [key: string]: IProduct[];
  all: IProduct[];
  fresh_food: IProduct[];
  fruit: IProduct[];
}

export default function TabProduct() {
  const [productsTab, setProductsTab] = useState<IProductTab>({
    all: [],
    fresh_food: [],
    fruit: []
  })
  const [activeKey, setActiveKey] = useState<string>('all')
  const tabItems = [
    {
      key: 'all',
      label: 'Tất cả',
      children: <Products products={productsTab.all} max={8} />,
      icon: <AppleOutlined />
    },
    {
      key: 'fresh_food',
      label: 'Đồ tươi sống',
      children: <Products products={productsTab.fresh_food} max={8} />,
      icon: <AppleOutlined />
    },
    {
      key: 'fruit',
      label: 'Trái cây',
      children: <Products products={productsTab.fruit} max={8} />,
      icon: <AppleOutlined />
    }
  ]

  const optionTab: { [key: string]: object; all: object; fresh_food: object; fruit: object } = {
    all: {},
    fresh_food: { category: '665452f10db33ec64d737b41' },
    fruit: { category: '665453ec0db33ec64d737b45' },
  }

  useEffect(() => {
    const fetchData = async () => {
      if (productsTab[activeKey].length == 0) {
        console.log('reload');
        const res = await getProducts(optionTab[activeKey])
        if (res.status === 'success') {
          setProductsTab({
            ...productsTab,
            [activeKey]: res.data
          })
        }
      }
    }
    fetchData()
  }, [activeKey])

  return (
    <Tabs
      defaultActiveKey={activeKey}
      items={tabItems}
      onChange={(activeKey: string) => setActiveKey(activeKey)}
    />
  );
}