'use client'

import { IUser } from "@/utils/schemas/User";
import { Col, Flex, Row, Table, TableProps } from "antd"

interface IUserTable {
  _user: IUser,
  totalBuy: number
}

const columnsUser: TableProps<IUserTable>['columns'] = [
  {
    title: 'Stt',
    key: 'stt',
    render: (_, __, index) => <p>{index + 1}</p>,
  },
  {
    title: 'Tên',
    key: 'name',
    render: (_, { _user }, index) => <p>{_user.name}</p>,
  },
  {
    title: 'Tổng mua',
    dataIndex: 'totalBuy',
    key: 'totalBuy',
  }
];

const dataUser: IUserTable[] = [
  {
    _user: {
      name: 'Linh'
    },
    totalBuy: 10
  },
  {
    _user: {
      name: 'Linh'
    },
    totalBuy: 10
  },
  {
    _user: {
      name: 'Linh'
    },
    totalBuy: 10
  },
  {
    _user: {
      name: 'Linh'
    },
    totalBuy: 20
  },
  {
    _user: {
      name: 'Linh'
    },
    totalBuy: 10
  },

];


export default function ReportUserAndProducts() {
  return (
    <Row gutter={12}>
      <Col span={6}>
        <Table bordered columns={columnsUser} dataSource={dataUser} pagination={false} />
      </Col>
      <Col span={18}>
        <Table bordered columns={columnsUser} dataSource={dataUser} pagination={false}/>
      </Col>
    </Row>
  )
}