'use client'
import CInput from "@/components/input";
import { Button } from "antd";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  return (
    <div className="relative px-5 py-8 config-shadow rounded-lg min-w-[400px] text-white text-center config-blur flex flex-col overflow-hidden gap-8">
      <p className="text-2xl">
        Quên Mật khẩu
      </p>
      <div className="flex flex-col gap-3">
        <CInput type="email" label="Email" value={email} onChange={setEmail} />
      </div>
      <Button loading className="bg-transparent bg-slate-100 bg-opacity-35 hover:bg-lime-300" type="primary" iconPosition='end'>
        Gửi mã
      </Button>
    </div>
  )
}