"use client";

import React from 'react';
import { shouldDisableAnimations } from '@/config/performance';

// Safe motion wrapper that handles missing motion gracefully
export const MotionDiv = (props: any) => {
  if (shouldDisableAnimations()) {
    // Return static div without motion props
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <div {...restProps} />;
  }
  
  try {
    const { motion } = require('framer-motion');
    return <motion.div {...props} />;
  } catch (error) {
    // Fallback to static div if framer-motion fails
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <div {...restProps} />;
  }
};

export const MotionButton = (props: any) => {
  if (shouldDisableAnimations()) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <button {...restProps} />;
  }
  
  try {
    const { motion } = require('framer-motion');
    return <motion.button {...props} />;
  } catch (error) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <button {...restProps} />;
  }
};

export const MotionSpan = (props: any) => {
  if (shouldDisableAnimations()) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <span {...restProps} />;
  }
  
  try {
    const { motion } = require('framer-motion');
    return <motion.span {...props} />;
  } catch (error) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <span {...restProps} />;
  }
};

export const MotionH2 = (props: any) => {
  if (shouldDisableAnimations()) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <h2 {...restProps} />;
  }
  
  try {
    const { motion } = require('framer-motion');
    return <motion.h2 {...props} />;
  } catch (error) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...restProps } = props;
    return <h2 {...restProps} />;
  }
};

// Safe AnimatePresence wrapper
export const SafeAnimatePresence = ({ children, ...props }: any) => {
  if (shouldDisableAnimations()) {
    return <>{children}</>;
  }
  
  try {
    const { AnimatePresence } = require('framer-motion');
    return <AnimatePresence {...props}>{children}</AnimatePresence>;
  } catch (error) {
    return <>{children}</>;
  }
};

// Export all motion components
export const SafeMotion = {
  div: MotionDiv,
  button: MotionButton,
  span: MotionSpan,
  h2: MotionH2,
  AnimatePresence: SafeAnimatePresence
};

export default SafeMotion;
