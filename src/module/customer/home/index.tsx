import Slide from "./Slide"
import Banner from "./Banner";
import TabProduct from "./TabsProduct";
import { Flex } from "antd";
import Service from "./Service";

export function Home() {
  return (
    <Flex vertical gap={'middle'}>
      <Slide />
      <Banner />
      {/* <TabProduct /> */}
      <Service />
    </Flex>
  );
}