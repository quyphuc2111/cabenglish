import React from "react";
import { CalendarRange, GraduationCap, Sparkle, User2 } from "lucide-react";
import { motion } from "framer-motion";

const StatisticalData = [
  {
    icon: <CalendarRange className="w-10 h-10" />,
    text: "10+",
    desc: "Năm kinh nghiệm",
    color: "from-green-400 to-green-600"
  },
  {
    icon: <Sparkle className="w-10 h-10" />,
    text: "98%",
    desc: "Giáo viên hài lòng",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: <GraduationCap className="w-10 h-10" />,
    text: "90K+",
    desc: "Giáo viên sử dụng",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: <User2 className="w-10 h-10" />,
    text: "100+",
    desc: "Nhân sự tận tâm",
    color: "from-pink-400 to-pink-600"
  }
];

function StatisticalSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const numberAnimation = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      className="container py-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className="flex flex-col md:flex-row gap-8 justify-between">
        {StatisticalData.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100"
                 style={{
                   backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                   '--tw-gradient-from': item.color.split(' ')[0],
                   '--tw-gradient-to': item.color.split(' ')[2]
                 }} />
            
            <div className="relative bg-white dark:bg-gray-900 px-8 py-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl">
              <div className="flex gap-6 items-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white`}
                >
                  {item.icon}
                </motion.div>
                
                <div className="flex flex-col items-end gap-2">
                  <motion.p 
                    className={`font-bold text-3xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                    variants={numberAnimation}
                  >
                    {item.text}
                  </motion.p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default StatisticalSection;

