"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function AvatarUser({avatarUrl, name, sidebar}: any) {
  const router = useRouter()

  const handleAvatarClick = () => {
  //  router.push('/bao-cao-hoc-tap')
  }

  return (
    <div className='flex flex-col items-center gap-4 mb-8 cursor-pointer relative' onClick={handleAvatarClick}>

       
        <div className='relative z-10'>
            <div className='w-[105px] h-[105px] rounded-full overflow-hidden shadow-lg'>
              <Image 
                src={avatarUrl || "/sidebar/avatar.png"} 
                alt="avatar-user" 
                width={145} 
                height={135}
                className="object-cover"
              />
            </div>
        </div>
        {sidebar?.isOpen && (
          <div className="text-[30px] font-semibold text-[#BD5353] leading-[1.21] relative z-10">
            {name || 'Caoanh'}
          </div>
        )}
    </div>
  )
}

export default AvatarUser