'use client';
import { Form, Modal, UploadFile } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import UploadImage from '../uploadImage';

interface IItemForm {
  name: string;
  label: string;
  required: boolean;
  children?: ReactNode;
  type: string[]
}

interface IPropsModal {
  title: string;
  itemsForm: IItemForm[];
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  handleSubmit: (param: any) => void;
  initValue?: { urlImage?: string };
}

export default function CModal({
  title,
  itemsForm,
  openModal,
  setOpenModal,
  handleSubmit,
  initValue = {},
}: IPropsModal) {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(initValue);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (initValue?.urlImage) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: initValue.urlImage,
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
    handleSubmit({ ...formData, urlImage: fileList[0]?.response?.url })
    setOpenModal(false);
  };

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
            if (title in item.type) {
              return <></>
            } else if (item.name === 'urlImage') {
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
