"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"

function AvatarUser({avatarUrl, name, sidebar}: any) {
  const router = useRouter()

  const handleAvatarClick = () => {
  //  router.push('/bao-cao-hoc-tap')
  }

  return (
    <div className={cn(
      'flex flex-col items-center gap-2 mb-2 cursor-pointer relative transition-all',
      sidebar?.isOpen === false ? 'px-0' : 'px-4'
    )} onClick={handleAvatarClick}>
      <div className='relative z-10'>
        <div className={cn(
          'rounded-full overflow-hidden transition-all',
          sidebar?.isOpen === false ? 'w-[70px] h-[70px]' : 'w-[105px] h-[105px]'
        )}>
          <Image 
            src={avatarUrl || "/sidebar/avatar.png"} 
            alt="avatar-user" 
            width={145} 
            height={135}
            className="object-cover w-full h-full"
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