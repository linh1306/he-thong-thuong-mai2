import { Button, Card, Carousel, Col, Grid, Row } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  const banners = [
    {
      url: '/image/banner/1.jpg',
      title: 'Bánh mỳ',
      description: 'Đồ ăn nhanh',
      path: ''
    },
    {
      url: '/image/banner/2.jpg',
      title: 'Bánh ngọt',
      description: 'Đa dạng hương vị',
      path: ''
    },
    {
      url: '/image/banner/3.jpg',
      title: 'Hoa quả',
      description: 'Nhập trong ngày, tươi ngon',
      path: ''
    }
  ]
  return (
    <Row gutter={[16, 24]}>
      {
        banners.map((banner, index) => (
          <Col key={index} className="gutter-row p-3" span={8}>
            <div className="relative flex items-center border-[1px] rounded-lg overflow-hidden">
              <div className="absolute font-sans left-5 flex flex-col gap-3">
                <p className="text-2xl font-bold">{banner.title}</p>
                <p className=" text-slate-500">{banner.description}</p>
                <Link href={banner.path}>
                  <Button type="primary" >Mua ngay</Button>
                </Link>
              </div>
              <Image className="w-full h-full object-cover" src={banner.url} alt={banner.url} width={1200} height={200} />
            </div>
          </Col>
        ))
      }
    </Row>
  );
}