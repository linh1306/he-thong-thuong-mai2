'use client'
import CInput from "@/components/input";
import { signIn } from "@/utils/api/Auth";
import createNotification from "@/utils/fuc/notification";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    setIsLoading(true)
    const form = { email, password }
    const res = await signIn(form)
    createNotification(res.status, res.message)
    setIsLoading(false)
    if (res.status === 'success') {
      route.push('/')
    }
  }

  return (
    <div className="relative px-5 py-8 config-shadow rounded-lg min-w-[400px] text-white text-center config-blur flex flex-col overflow-hidden gap-8">
      <p className="text-2xl">
        Đăng Nhập
      </p>
      <div className="flex flex-col gap-3">
        <CInput type="text" label="Email" value={email} onChange={setEmail} />
        <CInput type="password" label="Mật khẩu" value={password} onChange={setPassword} />
        <div className="flex justify-between text-xs">
          <Link className="" href="/auth/dang-ky" >Đăng ký</Link>
          <Link className="" href="/auth/quen-mat-khau" >Quên mật khẩu ?</Link>
        </div>
      </div>
      <Button loading={isLoading} onClick={handleSubmit} className="bg-slate-100 bg-opacity-35 hover:bg-lime-300" type="primary" iconPosition='end'>
        Đăng nhập
      </Button>
    </div>
  )
}