'use client'
import React, { useState } from 'react';
import {
  ProductOutlined,
  HomeOutlined,
  ContactsOutlined
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { useRouter } from 'next/navigation';
import CHeader from './header';

const { Sider } = Layout;

export default function CLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClickMenu: MenuProps['onClick'] = (e) => {
    router.push(e.key)
  }

  return (
    <Layout className='h-screen w-screen overflow-hidden'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          onClick={handleClickMenu}
          items={[
            {
              key: '/',
              icon: <HomeOutlined />,
              label: 'Trang chủ',
            },
            {
              key: '/mat-hang',
              icon: <ProductOutlined />,
              label: 'Mặt hàng',
            },
            {
              key: '/lien-he',
              icon: <ContactsOutlined />,
              label: 'Liên hệ',
            },
          ]}
        />
      </Sider>
      <Layout className='h-screen'>
        <CHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className='overflow-y-scroll'>
          <div className='m-3 p-3 rounded-xl bg-white' style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            {children}
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};