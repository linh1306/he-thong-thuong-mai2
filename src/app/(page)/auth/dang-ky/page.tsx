'use client'
import CCascaderAddress from "@/components/cascaderAddress";
import CInput from "@/components/input";
import { signUp } from "@/utils/api/Auth";
import createNotification from "@/utils/fuc/notification";
import { Button } from "antd";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [isLoading,setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState<string[]>([])
  const [detailedAddress, setDetailedAddress] = useState('')
  const [phone, setPhone] = useState('')
  
  const handleSubmit = async () => {
    setIsLoading(true)
    const res = await signUp({ name, email, password, address: [...address, detailedAddress], phone })
    createNotification(res.status, res.message)
    setIsLoading(false)
  }

  return (
    <div className="relative px-5 py-8 config-shadow rounded-lg min-w-[400px] text-white text-center config-blur flex flex-col overflow-hidden gap-8">
      <p className="text-2xl">
        Đăng Ký
      </p>
      <div className="flex flex-col gap-3">
        <CInput type="text" label="Họ và tên" value={name} onChange={setName} />
        <CInput type="email" label="Email" value={email} onChange={setEmail} />
        <div className="flex justify-center items-center gap-2">
          <CCascaderAddress value={address} onChange={setAddress} />
          <CInput type="text" label="Địa chỉ cụ thể" value={detailedAddress} onChange={setDetailedAddress} />
        </div>
        <CInput type="text" label="Số điện thoại" value={phone} onChange={setPhone} />
        <CInput type="password" label="Mật khẩu" value={password} onChange={setPassword} />
        <div className="flex justify-left text-xs">
          <Link className="" href="/auth/dang-nhap" >Đăng nhập</Link>
        </div>
      </div>
      <Button loading={isLoading} className="bg-slate-200 bg-opacity-35 hover:bg-lime-300" type="primary" iconPosition='end' onClick={handleSubmit}>
        Đăng ký
      </Button>
    </div>
  )
}