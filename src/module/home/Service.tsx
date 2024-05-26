import { Flex } from "antd";
import {
  CarOutlined,
  UserOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

export default function Service() {
  const services = [
    {
      icon: <CarOutlined className="text-4xl text-green-500" />,
      title: 'Giao hàng nhanh chóng',
      description: 'Giao hàng nhanh trong 2 ngày, giao hàng 63 tỉnh thành.'
    },
    {
      icon: <UserOutlined className="text-4xl text-green-500" />,
      title: 'Tư vấn 24/7',
      description: 'Đội ngũ tư vấn 24/7, giải đáp mọi thắc mắc.'
    },
    {
      icon: <CreditCardOutlined className="text-4xl text-green-500" />,
      title: 'Thanh toán tiện lợi',
      description: 'Hỗ trợ thanh toán online, nhanh chóng.'
    },
    {
      icon: <ShoppingCartOutlined className="text-4xl text-green-500" />,
      title: 'Ưu đãi',
      description: 'Các trương trình giảm giá và ưu đãi ở mọi mặt hàng.'
    },
    {
      icon: <SafetyCertificateOutlined className="text-4xl text-green-500" />,
      title: 'Sản phẩm chất lượng',
      description: 'Sản phẩm an toàn, tươi ngon. được sản xuất tại trang trại uy tín.'
    },
  ]
  return (
    <Flex gap={'small'}>
      {
        services.map((service, index) => (
          <Flex gap={'small'} className="flex-1 bg-slate-200 text-center rounded-md border-[1px] p-3" justify="center" align="center" vertical key={index}>
            {service.icon}
            <p className="font-semibold text-base">{service.title}</p>
            <p>{service.description}</p>
          </Flex>
        ))
      }
    </Flex>
  );
}