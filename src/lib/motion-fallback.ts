/**
 * Motion fallback for performance optimization
 * Provides static components when animations are disabled
 */

import React from 'react';
import { shouldDisableAnimations } from '@/config/performance';

// Create static motion components
const createStaticMotion = (element: string) => {
  return (props: any) => {
    // Remove motion-specific props
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
      whileInView,
      whileFocus,
      whileDrag,
      drag,
      dragConstraints,
      dragElastic,
      dragMomentum,
      ...restProps
    } = props;

    // Return static element
    return React.createElement(element, restProps);
  };
};

// Static motion object
const staticMotion = {
  div: createStaticMotion('div'),
  button: createStaticMotion('button'),
  span: createStaticMotion('span'),
  h1: createStaticMotion('h1'),
  h2: createStaticMotion('h2'),
  h3: createStaticMotion('h3'),
  p: createStaticMotion('p'),
  section: createStaticMotion('section'),
  article: createStaticMotion('article'),
  nav: createStaticMotion('nav'),
  header: createStaticMotion('header'),
  footer: createStaticMotion('footer'),
  main: createStaticMotion('main'),
  aside: createStaticMotion('aside'),
  ul: createStaticMotion('ul'),
  ol: createStaticMotion('ol'),
  li: createStaticMotion('li'),
  img: createStaticMotion('img'),
  a: createStaticMotion('a'),
  form: createStaticMotion('form'),
  input: createStaticMotion('input'),
  textarea: createStaticMotion('textarea'),
  select: createStaticMotion('select'),
  option: createStaticMotion('option'),
  label: createStaticMotion('label'),
  table: createStaticMotion('table'),
  thead: createStaticMotion('thead'),
  tbody: createStaticMotion('tbody'),
  tr: createStaticMotion('tr'),
  td: createStaticMotion('td'),
  th: createStaticMotion('th'),
};

// Static AnimatePresence
const staticAnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, {}, children);
};

// Export motion fallback
export const getMotion = () => {
  if (shouldDisableAnimations()) {
    return {
      motion: staticMotion,
      AnimatePresence: staticAnimatePresence,
    };
  }

  // Return real framer-motion
  try {
    const framerMotion = require('framer-motion');
    return {
      motion: framerMotion.motion,
      AnimatePresence: framerMotion.AnimatePresence,
    };
  } catch (error) {
    // Fallback to static if framer-motion not available
    console.warn('Framer Motion not available, using static components');
    return {
      motion: staticMotion,
      AnimatePresence: staticAnimatePresence,
    };
  }
};

// Global motion override
if (typeof window !== 'undefined' && shouldDisableAnimations()) {
  // Override framer-motion module
  try {
    const Module = require('module');
    const originalRequire = Module.prototype.require;
    
    Module.prototype.require = function(id: string) {
      if (id === 'framer-motion') {
        return {
          motion: staticMotion,
          AnimatePresence: staticAnimatePresence,
        };
      }
      return originalRequire.apply(this, arguments);
    };
  } catch (error) {
    // Module override not supported
  }
}
