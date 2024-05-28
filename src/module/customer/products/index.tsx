'use client'

import Products from "@/components/products"
import { getCategory } from "@/utils/api/customer/category"
import { getProducts } from "@/utils/api/customer/product"
import { removeEmptyFields } from "@/utils/fuc"
import { IOptionSearchPage } from "@/utils/schemas"
import { ICategory } from "@/utils/schemas/Category"
import { IProduct } from "@/utils/schemas/Product"
import { Button, Col, Row, Select, SelectProps, Slider, TreeSelect, Typography } from "antd"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface ISearchParams {
  category?: string;
  priceMin?: string;
  priceMax?: string;
  sortBy?: string;
  searchKey?: string
}

const optionSearch: IOptionSearchPage = {
  page_size: 10,
  current_page: 1,
}

export default function PageProducts() {
  const path = usePathname()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())
  const [category, setCategory] = useState<SelectProps['options']>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [findOption, setFindOption] = useState<ISearchParams>(removeEmptyFields(paramsObj))

  const createPath = () => {
    const keyValuePairs = path + '?'
    const options = []
    for (const key in findOption) {
      options.push(key + '=' + findOption[key as keyof ISearchParams])
    }
    return keyValuePairs + options.join('&');
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProducts({ ...removeEmptyFields(paramsObj), ...optionSearch })
      setProducts(res.data ?? [])
    }
    fetchData()
  }, [searchParams?.toString(), path])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategory()
      const resCategory: ICategory[] = res.data ?? []
      const optionCategory: SelectProps['options'] = resCategory.map(item => ({ label: item.name, value: (item?._id ?? '').toString() }))
      setCategory(optionCategory)
    }
    fetchData()
  }, [])

  return (
    <Row gutter={8} className="flex flex-nowrap">
      <Col flex='200px' className="relative">
        <div className="sticky top-4">
          <div className="relative rounded-md bg-slate-200 h-[90vh] p-3 flex  flex-col gap-3">
            <Typography.Title level={5}>Bộ lọc</Typography.Title>
            <div>
              <Typography.Text >Loại</Typography.Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn loại mặt hàng"
                defaultValue={searchParams.get('category')}
                onChange={(value) => { setFindOption(prop => ({ ...prop, category: value })) }}
                options={category}
              />
            </div>
            <div>
              <Typography.Text >Giá</Typography.Text>
              <Slider
                range
                defaultValue={[parseInt(searchParams.get('priceMin') ?? '0', 10), parseInt(searchParams.get('priceMax') ?? '3000', 10)]}
                max={3000} step={100}
                onChange={(value) => { setFindOption(prop => ({ ...prop, priceMin: value[0].toString(), priceMax: value[1].toString() })) }}
              />
            </div>
            <div>
              <Typography.Text >Sắp xếp theo</Typography.Text>
              <TreeSelect
                treeDataSimpleMode
                style={{ width: '100%' }}
                defaultValue={searchParams.get('sortBy') ?? ''}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                onChange={(value) => { setFindOption(prop => ({ ...prop, sortBy: value })) }}
                treeData={[
                  {
                    id: 1,
                    pId: 0,
                    value: 'new',
                    title: 'Mới nhất',
                  },
                  {
                    id: 2,
                    pId: 0,
                    value: 'sale',
                    title: 'Bán chạy',
                  },
                  {
                    id: 3,
                    pId: 0,
                    value: 'price',
                    title: 'Giá bán',
                    disabled: true,
                  },
                  {
                    id: 4,
                    pId: 3,
                    value: 'priceIncrease',
                    title: 'Tăng dần',
                  },
                  {
                    id: 5,
                    pId: 3,
                    value: 'priceReduce',
                    title: 'Giảm dần',
                  },

                ]}
              />
            </div>
            <Link href={createPath()}>
              <Button type="primary">Lọc</Button>
            </Link>
          </div>
        </div>
      </Col>
      <Col flex='auto' className="">
        <Products products={products} />
      </Col>
    </Row>
  )
}