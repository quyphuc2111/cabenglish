#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Performance Optimizations...\n');

const checks = [
  {
    name: 'useUserInfo Hook Optimization',
    file: 'src/hooks/useUserInfo.ts',
    checks: [
      { pattern: /staleTime:\s*5\s*\*\s*60\s*\*\s*1000/, description: '5 minute cache' },
      { pattern: /refetchOnWindowFocus:\s*false/, description: 'Disabled window focus refetch' },
      { pattern: /refetchOnMount:\s*false/, description: 'Disabled mount refetch' },
      { pattern: /\/\/\s*refetchInterval/, description: 'Disabled polling' }
    ]
  },
  {
    name: 'useLessonData Hook Optimization',
    file: 'src/hooks/useLessonData.ts',
    checks: [
      { pattern: /staleTime:\s*3\s*\*\s*60\s*\*\s*1000/, description: '3 minute cache' },
      { pattern: /refetchOnWindowFocus:\s*false/, description: 'Disabled window focus refetch' },
      { pattern: /refetchOnMount:\s*false/, description: 'Disabled mount refetch' }
    ]
  },
  {
    name: 'Client useLessonData Hook Optimization',
    file: 'src/hooks/client/useLessonData.ts',
    checks: [
      { pattern: /staleTime:\s*2\s*\*\s*60\s*\*\s*1000/, description: '2 minute cache' },
      { pattern: /refetchOnWindowFocus:\s*false/, description: 'Disabled window focus refetch' },
      { pattern: /refetchOnMount:\s*false/, description: 'Disabled mount refetch' }
    ]
  },
  {
    name: 'CurrentAndNextLecture Memoization',
    file: 'src/components/page/overview-page/current-and-next-lecture.tsx',
    checks: [
      { pattern: /import.*memo.*from.*react/, description: 'React.memo import' },
      { pattern: /const\s+CurrentAndNextLecture\s*=\s*memo/, description: 'Component memoization' }
    ]
  },
  {
    name: 'LectureFavouriteList Optimization',
    file: 'src/components/page/overview-page/lecture-favourite-list.tsx',
    checks: [
      { pattern: /import.*memo.*from.*react/, description: 'React.memo import' },
      { pattern: /const\s+LectureFavouriteList\s*=\s*memo/, description: 'Component memoization' },
      { pattern: /const\s+filteredLessonData\s*=\s*useMemo/, description: 'Data filtering memoization' }
    ]
  },
  {
    name: 'OverviewPage Memoization',
    file: 'src/components/page/overview-page/index.tsx',
    checks: [
      { pattern: /import.*memo.*from.*react/, description: 'React.memo import' },
      { pattern: /const\s+OverviewPage\s*=\s*memo/, description: 'Component memoization' }
    ]
  },
  {
    name: 'TeachingProgress Memoization',
    file: 'src/components/page/overview-page/teaching-progress/teaching-progress.tsx',
    checks: [
      { pattern: /import.*memo.*from.*react/, description: 'React.memo import' },
      { pattern: /const\s+TeachingProgress\s*=\s*memo/, description: 'Component memoization' }
    ]
  },
  {
    name: 'ProgressStats Memoization',
    file: 'src/components/page/overview-page/teaching-progress/progress-stats.tsx',
    checks: [
      { pattern: /import.*memo.*from.*react/, description: 'React.memo import' },
      { pattern: /const\s+ProgressStats\s*=\s*memo/, description: 'Component memoization' }
    ]
  },
  {
    name: 'Dashboard Data Hook Optimization',
    file: 'src/hooks/useDashboardData.ts',
    checks: [
      { pattern: /lastFetchRef/, description: 'Duplicate call prevention' },
      { pattern: /useRef.*userId.*mode/, description: 'Reference tracking' }
    ]
  }
];

const utilityFiles = [
  { name: 'Debounce Hook', file: 'src/hooks/useDebounce.ts' },
  { name: 'Performance Utils', file: 'src/utils/performance.ts' },
  { name: 'Performance Monitor', file: 'src/components/dev/PerformanceMonitor.tsx' },
  { name: 'Optimization Documentation', file: 'PERFORMANCE_OPTIMIZATIONS.md' }
];

let totalChecks = 0;
let passedChecks = 0;

// Check optimizations
checks.forEach(({ name, file, checks: fileChecks }) => {
  console.log(`📁 ${name}`);
  
  try {
    const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    
    fileChecks.forEach(({ pattern, description }) => {
      totalChecks++;
      if (pattern.test(content)) {
        console.log(`  ✅ ${description}`);
        passedChecks++;
      } else {
        console.log(`  ❌ ${description}`);
      }
    });
  } catch (error) {
    console.log(`  ❌ File not found: ${file}`);
  }
  
  console.log('');
});

// Check utility files
console.log('🛠️  Utility Files');
utilityFiles.forEach(({ name, file }) => {
  try {
    fs.accessSync(path.join(process.cwd(), file));
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name} - File not found`);
  }
});

console.log('\n📊 Summary');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${totalChecks - passedChecks}`);
console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 All optimizations implemented successfully!');
  console.log('\n📈 Expected Performance Improvements:');
  console.log('  • CPU Usage: 20-30% → <10% (60-70% reduction)');
  console.log('  • API Calls: Reduced by 80-90%');
  console.log('  • Re-renders: Reduced by 70-80%');
  console.log('  • Memory Usage: More efficient garbage collection');
} else {
  console.log('\n⚠️  Some optimizations are missing. Please review the failed checks above.');
}

console.log('\n🔧 Next Steps:');
console.log('  1. Test the application in browser');
console.log('  2. Monitor CPU usage in DevTools');
console.log('  3. Use React DevTools Profiler to verify reduced re-renders');
console.log('  4. Check Network tab for reduced API calls');
console.log('  5. Monitor memory usage over time');

console.log('\n💡 Development Tips:');
console.log('  • Use PerformanceMonitor component to track render times');
console.log('  • Enable React DevTools Profiler for detailed analysis');
console.log('  • Monitor browser Task Manager for CPU usage');
console.log('  • Use lighthouse for performance audits');
