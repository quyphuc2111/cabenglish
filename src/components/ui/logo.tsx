"use client"

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  colorMode?: "light" | "dark" | "gradient";
  animated?: boolean;
  href?: string;
  withYear?: boolean;
}

export const Logo = ({
  size = "md",
  colorMode = "gradient",
  animated = true,
  href = "/",
  withYear = true,
  className,
  ...props
}: LogoProps) => {
  // Size variants
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
  };

  // Color variants
  const colorClasses = {
    light: "text-white",
    dark: "text-gray-800",
    gradient: "bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600 text-transparent bg-clip-text",
  };

  // Animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const logoContent = (
    <div 
      className={cn(
        "font-extrabold tracking-wider flex items-center",
        sizeClasses[size],
        !animated && colorClasses[colorMode],
        animated && colorMode === "gradient" && "animate-text-shine",
        className
      )}
      {...props}
    >
      {animated ? (
        <>
          <div className="flex">
            {Array.from("SMART").map((letter, i) => (
              <motion.span
                key={`smart-${i}`}
                custom={i}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={letterVariants}
                className={cn(
                  colorMode === "gradient" ? 
                    "bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600 text-transparent bg-clip-text" :
                    colorClasses[colorMode]
                )}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <div className="flex ml-2">
            {Array.from("KID").map((letter, i) => (
              <motion.span
                key={`kid-${i}`}
                custom={i + 6} // continue from SMART
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={letterVariants}
                className={cn(
                  "bg-gradient-to-br from-amber-500 to-pink-600 text-transparent bg-clip-text"
                )}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          {withYear && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={cn(
                "ml-2 text-sm align-top font-bold pt-1",
                "bg-gradient-to-br from-amber-500 to-pink-600 text-transparent bg-clip-text"
              )}
            >
              {new Date().getFullYear()}
            </motion.span>
          )}
        </>
      ) : (
        <>
          <span>SMART KID</span>
          {withYear && (
            <span className={cn(
              "ml-1 text-sm align-top",
              colorMode === "gradient" ? 
                "bg-gradient-to-br from-amber-500 to-pink-600 text-transparent bg-clip-text" :
                "text-pink-500"
            )}>
              {new Date().getFullYear()}
            </span>
          )}
        </>
      )}
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return <Link href={href} className="no-underline">{logoContent}</Link>;
  }

  return logoContent;
}; 