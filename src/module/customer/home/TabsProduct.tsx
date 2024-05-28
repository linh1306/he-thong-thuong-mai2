import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import Products from "@/components/products";
import { IProduct } from "@/utils/schemas/Product";

export default function TabProduct() {
  const products: IProduct[] = [
    {
      name: 'Rau củ',
      price: 12000,
      description: 'mô tả',
      quantity: 123214,
      urlImage: '/image/product/product-1.jpg',
      percentSale: 10,
      numberOfReviews: 123,
      sumRating: 425,
      unit: 'cái',
    }
  ]
  const tabItems = [
    {
      key: '1',
      label: 'Tất cả',
      children: <Products products={products} />,
      icon: <AppleOutlined />
    },
    {
      key: '2',
      label: 'Bánh ngọt',
      children: <Products products={products} />,
      icon: <AppleOutlined />
    },
    {
      key: '3',
      label: 'Đồ tươi sống',
      children: <Products products={products} />,
      icon: <AppleOutlined />
    },
    {
      key: '4',
      label: 'Thức uống',
      children: <Products products={products} />,
      icon: <AppleOutlined />
    },
    {
      key: '5',
      label: 'Rau củ',
      children: <Products products={products} />,
      icon: <AppleOutlined />
    },

  ]
  return (
    <Tabs
      defaultActiveKey="1"
      items={tabItems}
    />
  );
}