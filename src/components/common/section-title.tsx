"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  wrapperClassName?: string;
  delay?: number;
  onClick?: () => void;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: {
    scale: 0,
    rotate: -180
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

function SectionTitle({
  title,
  image,
  wrapperClassName,
  delay = 0,
  onClick
}: SectionTitleProps) {
  const { src, alt, width, height } = image;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        "flex gap-2 items-center border-b-2 px-2 py-1",
        wrapperClassName
      )}
    >
      <motion.div variants={imageVariants}>
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt || "image"}
          className="object-contain"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
        className="text-xl font-medium w-fit "
      >
        {title}
      </motion.p>
    </motion.div>
  );
}

export default SectionTitle;
