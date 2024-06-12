'use client'
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select, Space, Table, Typography } from 'antd';

const App: React.FC = () => {
  const [form] = Form.useForm();

  const products = [
    {
      value: 'kasjd',
      label: 'Thịt sống'
    },
    {
      value: 'kasajd',
      label: 'Thịt bò'
    },
    {
      value: 'kasjsd',
      label: 'Thịt gà'
    },
    {
      value: 'kasgjd',
      label: 'Thịt lợn'
    }
  ]

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name="dynamic_form_complex"
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{ items: [] }}
    >

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3">Sản phẩm</th>
                  <th scope="col" className="py-3">Số lượng</th>
                  <th scope="col" className="py-3">Giá nhập</th>
                  <th scope="col" className="py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {fields.map((field) => (
                  <tr key={field.key} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className='w-44'>
                      <Form.Item className='m-0' name={[field.name, '_id']}>
                        <Select className='w-full' options={products} onChange={(value) => console.log(value)} />
                      </Form.Item>
                    </td>
                    <td className='w-30'>
                      <Form.Item className='m-0' name={[field.name, 'quantity']}>
                        <Input className='w-full' type='number' />
                      </Form.Item>
                    </td>
                    <td className='w-30'>
                      <Form.Item className='m-0' name={[field.name, 'price']}>
                        <Input className='w-full' type='number' />
                      </Form.Item>
                    </td>
                    <td className='flex'>
                      <Form.Item className='m-0'>
                        <CloseOutlined onClick={() => { remove(field.name) }} />
                      </Form.Item>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button type="dashed" onClick={() => add({})} block>
              + Add Item
            </Button>
          </div>
        )}
      </Form.List>

      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};

export default App;