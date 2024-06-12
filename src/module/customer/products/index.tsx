'use client'

import Products from "@/components/products"
import { getCategory } from "@/utils/api/customer/category"
import { getProducts } from "@/utils/api/customer/product"
import { createSearchParams, removeEmptyFields } from "@/utils/fuc"
import { IOptionSearchPage } from "@/utils/schemas"
import { ICategory } from "@/utils/schemas/Category"
import { IProduct } from "@/utils/schemas/Product"
import { Button, Col, Empty, Pagination, Row, Select, SelectProps, Slider, Spin, TreeSelect, Typography } from "antd"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageProducts() {
  const path = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsObj = Object.fromEntries(searchParams.entries())

  const initOption = {
    currentPage: parseInt(paramsObj.currentPage ?? 1),
    pageSize: 12,
    category: paramsObj.category ?? '',
    searchKey: paramsObj.searchKey ?? '',
    totalDocuments: 0,
    priceMin: parseInt(paramsObj.priceMin ?? '0'),
    priceMax: parseInt(paramsObj.priceMax ?? '3000'),
    sortBy: paramsObj.sortBy ?? '',
  }

  const [category, setCategory] = useState<SelectProps['options']>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [reload, setReload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [optionPage, setOptionPage] = useState(initOption)

  useEffect(() => {
    setOptionPage(initOption)
    setReload(prop => !prop)
  }, [searchParams.toString()])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await getProducts(optionPage)
      console.log(res);
      setOptionPage(prop => ({ ...prop, ...res.options }))
      setProducts(res.data)
      setLoading(false)
    }
    fetchData()
  }, [reload])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategory()
      const resCategory: ICategory[] = res.data ?? []
      const optionCategory: SelectProps['options'] = resCategory.map(item => ({ label: item.name, value: (item?._id ?? '').toString() }))
      setCategory(optionCategory)
    }
    fetchData()
  }, [])

  const handleFind = () => {
    const { pageSize, totalDocuments, searchKey, ...optionFetch } = optionPage
    const newSearchParam = createSearchParams(path, { ...optionFetch, currentPage: 1 })
    route.push(newSearchParam)
    setOptionPage(prop => ({ ...prop, currentPage: 1 }));
    setReload(prop => !prop)
  }

  const handleChangePagination = (page: number, pageSize: number) => {
    const { totalDocuments, searchKey, ...optionFetch } = optionPage
    const newRoute = createSearchParams(path, { ...optionFetch, currentPage: page })
    route.push(newRoute)
    setOptionPage(prop => ({ ...prop, currentPage: page }));
    setReload(prop => !prop)
  }

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
                allowClear
                defaultValue={searchParams.get('category')}
                onChange={(value) => { setOptionPage(prop => ({ ...prop, category: value })) }}
                options={category}
              />
            </div>
            <div>
              <Typography.Text >Giá</Typography.Text>
              <Slider
                range
                defaultValue={[parseInt(searchParams.get('priceMin') ?? '0', 10), parseInt(searchParams.get('priceMax') ?? '3000', 10)]}
                max={3000} step={100}
                onChange={(value) => { setOptionPage(prop => ({ ...prop, priceMin: value[0], priceMax: value[1] })) }}
              />
            </div>
            <div>
              <Typography.Text >Sắp xếp theo</Typography.Text>
              <TreeSelect
                style={{ width: '100%' }}
                defaultValue={searchParams.get('sortBy') ?? ''}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                onChange={(value) => { setOptionPage(prop => ({ ...prop, sortBy: value })) }}
                treeDefaultExpandAll
                treeData={[
                  {
                    title: 'Mới nhất',
                    value: 'new',
                  },
                  {
                    title: 'Bán chạy',
                    value: 'sale',
                  },
                  {
                    title: 'Giá bán',
                    value: 'price',
                    disabled: true,
                    children: [
                      {
                        title: 'Tăng dần',
                        value: 'priceIncrease'
                      },
                      {
                        title: 'Giảm dần',
                        value: 'priceReduce'
                      }
                    ]
                  },

                ]}
              />
            </div>
            <Button className="cursor-pointer" type="primary" onClick={handleFind}>Lọc</Button>
          </div>
        </div>
      </Col>
      <Col flex='auto' className="">
        {
          loading ?
            <div className="w-full flex justify-center items-center">
              <Spin />
            </div>
            :
            <>
              {
                products.length > 0 ?
                  <Products products={products} />
                  :
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
              <Pagination className="mt-4" defaultCurrent={optionPage.currentPage} total={optionPage.totalDocuments} onChange={handleChangePagination} />
            </>
        }
      </Col>
    </Row>
  )
}