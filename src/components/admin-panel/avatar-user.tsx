import React from 'react'
import Image from 'next/image'
import { Badge } from '../ui/badge'

function AvatarUser({avatarUrl, name}: any) {
  return (
    <div className='flex flex-col items-center gap-3 text-white'>
        <div className='relative avatar-container'>
            <div className='bg-white rounded-full p-1'>
            <Image src={"https://static.edupia.vn/images/avata_system/55.png"} alt="avatar-user" width={80} height={80} />
            </div>
            <Badge className='bg-[#1ACAEF] rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14'>Lớp 5</Badge>
        </div>
        <div className="ml-2 text-lg font-semibold">{name || 'Bê Ka Tê'}</div>
    </div>
  )
}

export default AvatarUser