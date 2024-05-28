import { Carousel } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function Slide() {
  const slides = [
    {
      url:'/image/slide/slide-1.jpg',
      path:''
    },
    {
      url:'/image/slide/slide-2.jpg',
      path:''
    }
  ]
  return (
    <Carousel className="w-full">
      {
        slides.map((slide) => (
          <div key={slide.url} className="w-full overflow-hidden bg-red-400">
            <Image className="w-full h-full object-cover" src={slide.url} alt={slide.url} width={1200} height={200} />
          </div>
        ))
      }
    </Carousel>
  );
}