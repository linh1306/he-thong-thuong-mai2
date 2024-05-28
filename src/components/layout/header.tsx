'use client'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Header } from "antd/es/layout/layout"
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Divider, Dropdown, Flex, Space, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import Search from 'antd/es/input/Search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IHeaderProp {
  collapsed: boolean;
  setCollapsed: any;
}
interface IUser {
  name: string,
  address: string,
  email: string,
  urlImage: string,
  account: string,
  password: string,
  role: string,
}


function CpnUser({ user }: { user: IUser }) {
  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => (
        <div className='bg-white config-shadow overflow-hidden rounded-lg min-w-48'>
          <div>
            <div className='w-full h-10 bg-pink-400'></div>
            <div className='relative w-full flex justify-center'>
              <div className='absolute w-full h-1/2 bg-pink-400'></div>
              <Avatar className='' size={70} icon={<Image src={user.urlImage} alt='avatar' width={70} height={70} />} />
            </div>
          </div>
          <Flex vertical gap='small' className='p-3 text-center'>
            <Flex vertical>

              <p className='text-base'>{user.name}</p>
              <p className='text-xs text-slate-400'>{user.email}</p>
            </Flex>
            <Flex vertical gap='small'>
              <Divider style={{ margin: 0 }} />
              <Button icon={<LogoutOutlined />} >Đăng xuất</Button>
            </Flex>
          </Flex>
        </div>
      )}
    >
      <Avatar className='cursor-pointer' size='large' icon={<Image src={user.urlImage} alt='avatar' width={70} height={70} />} />
    </Dropdown>
  )
}

export default function CHeader({ collapsed, setCollapsed }: IHeaderProp) {
  const router = useRouter();
  const path = usePathname()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())
  const [searchKey, setSearchKey] = useState('')

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const user: IUser = {
    name: 'Nguyễn Văn Linh',
    address: 'ninh binh',
    email: 'nguyenlinh13602@gmail.com',
    urlImage: '/image/imageUser/avatar-0.png',
    account: 'ádasdhasodh',
    password: 'idsdaksd',
    role: 'áduaddhaodd',
  }

  useEffect(() => {
    setSearchKey('')
  }, [router,searchParams])


  const handleSearch = () => {
    if (path === '/mat-hang') {
      const newSearchParam = new URLSearchParams({ ...paramsObj, searchKey }).toString()
      router.push(`/mat-hang?${newSearchParam}`)
    } else {
      router.push(`/mat-hang?searchKey=${searchKey}`)
    }
  }
  return (
    <Header className='w-full z-50 border-b-2 px-3' style={{ background: colorBgContainer }}>
      <Flex className='w-full' justify='space-between' align='center' >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Flex className='w-[600px]'>
          <Search value={searchKey} placeholder='Tìm kiếm tên sản phẩm' onChange={(e) => { setSearchKey(e.target.value) }} onSearch={handleSearch} />
        </Flex>
        <Flex gap='large' align='center'>
          <Link href={'/gio-hang'}>
            <Badge size='small' count={1}>
              <Avatar size='small' icon={<ShoppingCartOutlined />} />
            </Badge>
          </Link>
          <CpnUser user={user} />
        </Flex>
      </Flex>
    </Header>
  )
}