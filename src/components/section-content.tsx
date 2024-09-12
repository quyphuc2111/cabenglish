import React from 'react'
import { cn } from '@/lib/utils'

function SectionContent({children, className}: any) {
  return (
    <div className={cn('bg-white p-8 shadow-course-inset rounded-2xl', className)}>
        {children}
    </div>
  )
}

export default SectionContent