'use client'
import React, { useEffect, useState } from 'react';
import {
  ProductOutlined,
  HomeOutlined,
  ContactsOutlined
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import CHeader from './header';
import { getCategory } from '@/utils/api/customer/category';
import { ICategory } from '@/utils/schemas/Category';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';

type MenuItem = Required<MenuProps>['items'][number];

const { Sider } = Layout;

export default function CLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const userStore = useSelector((state: RootState) => state.user)
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClickMenu: MenuProps['onClick'] = (e) => {
    router.push(e.key)
  }
  const [routes, setRoutes] = useState<MenuItem[]>([
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ'
    },
    {
      key: '/mat-hang',
      icon: <ProductOutlined />,
      label: 'Mặt hàng'
    },
    {
      key: '/lien-he',
      icon: <ContactsOutlined />,
      label: 'Liên hệ'
    },
  ])

  useEffect(() => {
    const getListCategory = async () => {
      const resCategory = await getCategory();
      console.log(resCategory)
      const categories: ICategory[] = resCategory.data
      const newRoutes = routes.map(route => {
        if (route?.key === '/mat-hang') {
          return {
            ...route,
            children: categories.map(category => ({
              key: `/mat-hang?category=${category._id}`,
              label: category.name,
            })),
          };
        }
        return route;
      });
      setRoutes(newRoutes);
    }
    getListCategory()
  }, [])

  const routerMenu = [...routes]

  if (userStore.role === 'admin') {
    routerMenu.push({
      key: '/admin',
      icon: <ContactsOutlined />,
      label: 'Admin',
      children: [
        {
          key: '/admin/dashboard',
          label: 'Dashboard'
        },
        {
          key: '/quan-ly',
          label: 'Quản lý',
          children: [
            {
              key: '/admin/quan-ly-nhanh',
              label: 'Quản lý nhanh'
            },
            {
              key: '/admin/quan-ly-loai-mat-hang',
              label: 'Loại mặt hàng'
            },
            {
              key: '/admin/quan-ly-mat-hang',
              label: 'Mặt hàng'
            },
            {
              key: '/admin/quan-ly-nguoi-dung',
              label: 'Người dùng'
            },
            {
              key: '/admin/quan-ly-lien-he',
              label: 'Liên hệ'
            },
            {
              key: '/admin/quan-ly-nha-cung-cap',
              label: 'Nhà cung cấp'
            },
          ]
        }
      ]
    })
  }
  if (userStore.role === 'employee') {
    routerMenu.push({
      key: '/employee',
      icon: <ContactsOutlined />,
      label: 'Nhân viên',
      children: [
        {
          key: '/employee/nhap-hang',
          label: 'Nhập hàng'
        },
        {
          key: '/employee/xuat-hang',
          label: 'Xuất hàng'
        },
        {
          key: '/employee/mat-hang-trong-kho',
          label: 'Mặt hàng trong kho'
        },
      ]
    })
  }


  return (
    <Layout className='h-screen w-screen overflow-hidden'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={handleClickMenu}
          items={routerMenu}
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
