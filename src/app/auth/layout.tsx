import backgroundAuth from '@/../public/image/background-auth.jpg'
import Image from 'next/image'

export default function authLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='w-full h-screen bgr-auth flex justify-center items-center'>
      {children}
    </div>
  )
}