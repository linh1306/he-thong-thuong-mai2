'use client';
import { IContact } from "@/utils/schemas/Contact";
import { Flex, Pagination, Select, Table, TableProps, Tag } from "antd";
import { useEffect, useState } from "react";
import createNotification from "@/utils/fuc/notification";
import { createSearchParams, removeEmptyFields } from "@/utils/fuc";
import { getContacts, updateStatusContact } from "@/utils/api/admin/contact";
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Search from "antd/es/input/Search";

export default function ManageContact() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())
  
  const [contact, setContact] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)
  const [optionPage, setOptionPage] = useState({
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 10,
    status: paramsObj.status ?? '',
    searchKey: paramsObj.searchKey ?? '',
    totalDocuments: 0
  })
  const columns: TableProps<IContact>['columns'] = [
    {
      key: 'stt',
      title: <p>{optionPage.totalDocuments}</p>,
      render: (_, __, index) => <p>{index + 1 + (optionPage.currentPage - 1) * 10}</p>,
    },
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    Table.EXPAND_COLUMN,
    {
      key: 'description',
      title: 'Nội dung',
      render: (_, item) => <p className="text-nowrap overflow-hidden text-ellipsis w-20">{item.description}</p>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, contact) => (
        <>
          {contact?.status ?
            <Tag className="cursor-pointer" color="success" onClick={() => handleClickChangeStatusContact({ contact, newStatus: false })}>Đã xử lý</Tag>
            :
            <Tag className="cursor-pointer" color="default" onClick={() => handleClickChangeStatusContact({ contact, newStatus: true })}>Chưa xử lý</Tag>
          }
        </>
      ),
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await getContacts(optionPage);
      console.log(res, optionPage);
      if (res.status === 'success') {
        setOptionPage(prop => ({ ...prop, ...res.options }))
        setContact(res.data);
      }
      setLoading(false)
    };
    fetchData();
  }, [reload]);

  const handleSearch = () => {
    const { pageSize, totalDocuments, ...optionFetch } = optionPage
    const newSearchParam = createSearchParams(path, optionFetch)
    route.push(newSearchParam)
    setOptionPage(prop => ({ ...prop, currentPage: 1 }))
    setReload(prop => !prop)
  }

  const handleChangePagination = (page: number, pageSize: number) => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('currentPage', page.toString())
    setOptionPage(prop => ({ ...prop, currentPage: page }));
    route.push(`${path}?${urlSearchParams.toString()}`)
    setReload(prop => !prop)
  }

  const handleClickChangeStatusContact = async ({ contact, newStatus }: { contact: IContact, newStatus: boolean }) => {
    const res = await updateStatusContact({ _id: contact._id!, status: newStatus! })
    if (res.status === 'success') {
      setReload(prop => !prop)
    }
    createNotification(res.status, res.message)
  };
  return (
    <Flex vertical gap={10}>
      <Flex className="w-full" justify="space-between">
        <Flex className="w-80" gap={3}>
          <Select
            className="flex-1"
            defaultValue={optionPage.status}
            allowClear
            options={[{ label: 'Chưa xử lý', value: 'false' }, { label: 'Đã xử lý', value: 'true' }]}
            onChange={(value) => { setOptionPage(prop => ({ ...prop, status: value })) }} />
          <Search
            className="flex-1"
            value={optionPage.searchKey}
            placeholder='Tìm kiếm theo email'
            onChange={(e) => { setOptionPage(prop => ({ ...prop, searchKey: e.target.value })) }}
            onSearch={handleSearch} />
        </Flex>
      </Flex>
      <Table pagination={false} loading={loading}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
        }}
        columns={columns} dataSource={contact} rowKey="_id" />
      <Pagination defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
    </Flex>
  );
}
