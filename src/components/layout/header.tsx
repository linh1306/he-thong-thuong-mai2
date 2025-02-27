'use client'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Header } from "antd/es/layout/layout"
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Divider, Dropdown, Flex, List, Space, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import Search from 'antd/es/input/Search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IUser } from '@/utils/schemas/User';
import { setUserStore } from '@/utils/redux/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { getMe } from '@/utils/api/customer/getMe';
import { deleteToken } from '@/utils/api/Auth';
import { getNotificationsMe, updateStatusNotification } from '@/utils/api/customer/notification';
import { INotification } from '@/utils/schemas/Notification';

interface IHeaderProp {
  collapsed: boolean;
  setCollapsed: any;
}

interface ICpnUserProp {
  user: IUser | null;
  handleLogout: () => void
}

function CpnNotification() {
  const [notification, setNotification] = useState<INotification[]>([])
  const [reload, setReload] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotificationsMe()
      if (res.status === 'success') {
        setNotification(res.data)
      }
    };
    fetchData();
  }, [reload])
  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => (
        <div className='bg-white p-4 config-shadow overflow-hidden rounded-lg min-w-80'>
          <List
            itemLayout="horizontal"
            dataSource={notification}
            renderItem={(item, index) => (
              <List.Item actions={[
                <Button
                key={'btn'}
                  type="text"
                  size='small'
                  icon={<CloseOutlined />}
                  onClick={async () => {
                    await updateStatusNotification({ _id: item._id ?? '', status: true })
                    setReload(prop => !prop)
                  }}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                />
              ]}>
                <List.Item.Meta
                  avatar={<Avatar className='cursor-pointer' size='large' icon={<Image src={'/image/user.png'} alt='avatar' width={70} height={70} />} />}
                  title={'Admin'}
                  description={
                    <div className=''>
                      <p>{item.description}<strong className='text-black'> {item.code ?? ''}</strong></p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    >
      <Badge size='small' count={notification.length}>
        <Avatar size='small' icon={<BellOutlined />} />
      </Badge>
    </Dropdown>
  )
}

function CpnCart() {
  const cartStore = useSelector((state: RootState) => state.cart)
  const size = cartStore.length
  return (
    <Link href={'/gio-hang'}>
      <Badge size='small' count={size ? size : ''}>
        <Avatar size='small' icon={<ShoppingCartOutlined />} />
      </Badge>
    </Link>
  )
}

function CpnUser({ user, handleLogout }: ICpnUserProp) {
  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => (
        <div className='bg-white config-shadow overflow-hidden rounded-lg min-w-48'>
          <div>
            <div className='w-full h-10 bg-pink-400'></div>
            <div className='relative w-full flex justify-center'>
              <div className='absolute w-full h-1/2 bg-pink-400'></div>
              <Avatar className='' size={70} icon={<Image src={user?.urlImage!} alt='avatar' width={70} height={70} />} />
            </div>
          </div>
          <Flex vertical gap='small' className='p-3 text-center'>
            <Flex vertical>
              <p className='text-base'>{user?.name}</p>
              <p className='text-xs text-slate-400'>{user?.email}</p>
            </Flex>
            <Flex vertical gap='small' align='start'>
              <Divider style={{ margin: 0 }} />
              <Link href={'/don-hang'}>Đơn hàng</Link>
            </Flex>
            <Flex vertical gap='small'>
              <Divider style={{ margin: 0 }} />
              <Button icon={<LogoutOutlined />} onClick={handleLogout} >Đăng xuất</Button>
            </Flex>
          </Flex>
        </div>
      )}
    >
      <Avatar className='cursor-pointer' size='large' icon={<Image src={user?.urlImage!} alt='avatar' width={70} height={70} />} />
    </Dropdown>
  )
}

export default function CHeader({ collapsed, setCollapsed }: IHeaderProp) {
  const router = useRouter();
  const dispatch = useDispatch()
  const userStore = useSelector((state: RootState) => state.user)
  const searchParams = useSearchParams()
  const [searchKey, setSearchKey] = useState('')
  const [user, setUser] = useState<IUser>(userStore)

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const fetchGetMe = async () => {
      const res = await getMe()
      if (res.status === 'success') {
        dispatch(setUserStore(res.data))
        setUser(res.data)
      }
    }
    fetchGetMe()
  }, [JSON.stringify(userStore) === JSON.stringify(user)])

  useEffect(() => {
    setSearchKey('')
  }, [router, searchParams])

  const handleSearch = () => {
    router.push(`/mat-hang?searchKey=${searchKey}`)
  }

  const handleLogout = async () => {
    await deleteToken()
    dispatch(setUserStore({}))
    setUser({})
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
          <Search value={searchKey} allowClear placeholder='Tìm kiếm tên sản phẩm' onChange={(e) => { setSearchKey(e.target.value) }} onSearch={handleSearch} />
        </Flex>
        <Flex gap='small' align='center'>
          <CpnCart />
          {Object.keys(user).length > 0 ?
            <>
              <CpnNotification />
              <CpnUser user={user} handleLogout={handleLogout} />
            </>
            :
            <Link href={'/auth/dang-nhap'}>
              <Button size='small' shape='round'>
                Đăng nhập
              </Button>
            </Link>
          }
        </Flex>
      </Flex>
    </Header>
  )
}