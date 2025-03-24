"use client"
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

function AdminDashboardCardInfo({title, value, imageUrl}: {title: string, value: number, imageUrl: string}) {
  return (
    <motion.div 
      className='shadow-md p-[2px] rounded-lg max-h-[200px]'
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='bg-white rounded-lg p-6 h-full'>
        <motion.div 
          className='flex justify-between items-center mb-4'
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <p className='text-gray-600 font-medium text-lg'>{title}</p>
          <motion.div 
            className='relative'
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image 
              src={imageUrl} 
              alt={title} 
              width={64} 
              height={64}
              className='rounded-full'
            />
          </motion.div>
        </motion.div>
        <motion.p 
          className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  )
}

export default AdminDashboardCardInfo