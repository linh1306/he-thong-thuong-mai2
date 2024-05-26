'use client'
import CInput from "@/components/input";
import { useSignIn } from "@/utils/hooks/Auth";
import { Button } from "antd";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async () => {
    const form = { email, password }
    console.log(form);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res = await useSignIn(form)
    console.log(res);
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
      <Button onClick={handleSubmit} className="bg-transparent bg-slate-100 bg-opacity-35 hover:bg-lime-300" type="primary" iconPosition='end'>
        Đăng nhập
      </Button>
    </div>
  )
}