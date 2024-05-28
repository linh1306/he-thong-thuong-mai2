import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import Products from "@/components/products";

export default function TabProduct() {
  const tabItems = [
    {
      key:'1',
      label:'Tất cả',
      children:<Products />,
      icon: <AppleOutlined/>
    },
    {
      key:'2',
      label:'Bánh ngọt',
      children:<Products />,
      icon: <AppleOutlined/>
    },
    {
      key:'3',
      label:'Đồ tươi sống',
      children:<Products />,
      icon: <AppleOutlined/>
    },
    {
      key:'4',
      label:'Thức uống',
      children:<Products />,
      icon: <AppleOutlined/>
    },
    {
      key:'5',
      label:'Rau củ',
      children:<Products />,
      icon: <AppleOutlined/>
    },
    
  ]
  return (
    <Tabs
      defaultActiveKey="1"
      items={tabItems}
    />
  );
}