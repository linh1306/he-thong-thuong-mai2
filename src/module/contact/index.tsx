'use client'

import { Button, Col, Flex, Form, FormInstance, Input, Row, Space } from "antd"
import TextArea from "antd/es/input/TextArea";
import React from "react";

interface SubmitButtonProps {
  form: FormInstance;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children }) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};

export default function PageContact() {
  const [form] = Form.useForm();
  return (
    <div className="text-center flex flex-col gap-3">
      <div>
        <p className="font-bold text-2xl text-green-500">Bạn có thắc mắc?</p>
        <p className="text-slate-500">Chúng tôi luôn ở đây lắng nghe bạn, hãy để lại thông tin liên lạc.</p>
      </div>
      <Row gutter={30}>
        <Col span={12}>
          <iframe className="w-full h-full overflow-hidden rounded-md shadow-md" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.292639415326!2d105.78256697843307!3d20.98090343078045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1716561259256!5m2!1svi!2s" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </Col>
        <Col span={12}>
          <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="số điện thoại" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="message" label="Nội dung" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space>
                <SubmitButton form={form}>Submit</SubmitButton>
                <Button htmlType="reset">Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}