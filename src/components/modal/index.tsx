'use client';
import { Cascader, Form, Modal, UploadFile } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import UploadImage from '../uploadImage';

interface IItemForm {
  name: string;
  label: string;
  required: boolean;
  children?: ReactNode;
  type: string[]
}

interface IPropsModal<T> {
  title: string;
  itemsForm: IItemForm[];
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  handleSubmit: (param: any) => void;
  initValue: object;
}

export default function CModal<T = object>({
  title,
  itemsForm,
  openModal,
  setOpenModal,
  handleSubmit,
  initValue = {},
}: IPropsModal<T>) {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(initValue);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if ('urlImage' in initValue) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: initValue.urlImage as string ?? '',
      }])
    } else {
      setFileList([])
    }
    form.setFieldsValue(initValue);
    setFormData(initValue);
  }, [initValue]);

  const handleChange = (_: any, allValues: any) => {
    setFormData(allValues);
  };

  const handleOk = () => {
    let valueSubmit = formData
    if (fileList.length > 0) {
      valueSubmit = { ...valueSubmit, urlImage: fileList[0]?.response?.url }
      }
    handleSubmit(valueSubmit)
  }

  const handleCancel = () => {
    form.resetFields();
    setFormData(initValue);
    setOpenModal(false);
  };

  return (
    <Modal open={openModal} title={title} onOk={handleOk} onCancel={handleCancel}>
      {title === 'Delete' ? (
        'Bạn chắc chắn muốn xóa?'
      ) : (
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          initialValues={formData}
          onValuesChange={handleChange}
        >
          {itemsForm.map((item, index) => {
            if (item.name === 'urlImage') {
              return (<UploadImage key={index} fileList={fileList} setFileList={setFileList} />)
            } else {
              return (
                <Form.Item
                  key={index}
                  name={item.name}
                  label={item.label}
                  rules={[{ required: item.required }]}
                >
                  {item.children}
                </Form.Item>
              )
            }
          })}
        </Form>
      )}
    </Modal>
  );
}
