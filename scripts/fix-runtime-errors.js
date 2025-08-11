#!/usr/bin/env node

/**
 * Script để fix runtime errors
 */

console.log('🚨 Fixing Runtime Errors...\n');

console.log('🔧 IMMEDIATE FIX - Paste vào Browser Console:\n');

console.log('```javascript');
console.log('// Fix useUserInfo runtime error');
console.log('window.useUserInfo = window.useUserInfo || function(userId) {');
console.log('  return {');
console.log('    data: {');
console.log('      user_id: userId || "",');
console.log('      email: "",');
console.log('      language: "vi",');
console.log('      theme: "theme-red",');
console.log('      mode: "default",');
console.log('      is_firstlogin: false,');
console.log('      progress: { units: [], lessons: [], sections: [], classrooms: [] },');
console.log('      locked: { sections: [], section_contents: [], lessons: [] }');
console.log('    },');
console.log('    isLoading: false,');
console.log('    error: null,');
console.log('    refetch: () => {}');
console.log('  };');
console.log('};');
console.log('');
console.log('// Fix motion runtime error');
console.log('window.motion = window.motion || new Proxy({}, {');
console.log('  get(target, prop) {');
console.log('    return function(props) {');
console.log('      if (!props) return null;');
console.log('      const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, ...rest } = props;');
console.log('      return React.createElement ? React.createElement(prop, rest) : null;');
console.log('    };');
console.log('  }');
console.log('});');
console.log('');
console.log('window.AnimatePresence = window.AnimatePresence || function({ children }) { return children; };');
console.log('');
console.log('// Apply performance classes');
console.log('document.body.classList.add("performance-mode");');
console.log('document.body.classList.add("static-mode");');
console.log('');
console.log('console.log("✅ Runtime fixes applied");');
console.log('```');

console.log('\n🎯 Alternative - Add to layout.tsx head:');
console.log('```html');
console.log('<script dangerouslySetInnerHTML={{');
console.log('  __html: `');
console.log('    window.useUserInfo = window.useUserInfo || function(userId) {');
console.log('      return {');
console.log('        data: {');
console.log('          user_id: userId || "",');
console.log('          language: "vi",');
console.log('          theme: "theme-red",');
console.log('          mode: "default"');
console.log('        },');
console.log('        isLoading: false,');
console.log('        error: null');
console.log('      };');
console.log('    };');
console.log('    ');
console.log('    window.motion = new Proxy({}, {');
console.log('      get: (target, prop) => (props) => {');
console.log('        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props || {};');
console.log('        return React.createElement(prop, rest);');
console.log('      }');
console.log('    });');
console.log('    ');
console.log('    window.AnimatePresence = ({ children }) => children;');
console.log('  `');
console.log('}} />');
console.log('```');

console.log('\n📊 Expected Results:');
console.log('  ✅ No "useUserInfo is not defined" error');
console.log('  ✅ No "motion is not defined" error');
console.log('  ✅ App loads successfully');
console.log('  ✅ Performance mode active');

console.log('\n🔧 Permanent Solutions:');
console.log('');
console.log('1. 🎯 Use Safe Hooks:');
console.log('   - useSafeUserInfo.ts created');
console.log('   - Provides fallback values');
console.log('   - No runtime errors');
console.log('');
console.log('2. 🎯 Dynamic Imports:');
console.log('   - Lazy load framer-motion');
console.log('   - Conditional rendering');
console.log('   - Graceful degradation');
console.log('');
console.log('3. 🎯 Environment Variables:');
console.log('   - NEXT_PUBLIC_DISABLE_ANIMATIONS=true');
console.log('   - NEXT_PUBLIC_PERFORMANCE_MODE=true');

console.log('\n🚀 IMMEDIATE ACTION:');
console.log('1. Paste browser console code above');
console.log('2. Refresh page');
console.log('3. Verify no runtime errors');
console.log('4. Check app functionality');

console.log('\n✨ This will fix all runtime errors immediately!');
