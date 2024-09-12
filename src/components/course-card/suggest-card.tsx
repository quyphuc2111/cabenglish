import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

function SuggestCard({className}: any) {
  return (
    <div className={cn("bg-white flex items-center gap-2 p-4 shadow-course-inset rounded-3xl border", className)}>
        <div>
            <Image src="https://static.edupia.vn/uploads/v3/assets/images/lesson_type/1.png" alt="lesson" width={93} height={93}  />
        </div>
        <div>
            <p className='text-zinc-400'>Tiếng Anh Lớp 1 - Unit 9</p>
            <p className='font-semibold my-2'>Từ vựng</p>
            <p className='text-zinc-400'>Các đồ vật trong cửa hàng</p>
            <p className='text-zinc-400'>100/400 điểm - 25%</p>
        </div>
    </div>
  )
}

export default SuggestCard