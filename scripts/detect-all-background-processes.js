#!/usr/bin/env node

/**
 * Script để detect TẤT CẢ background processes gây CPU cao
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Detecting ALL Background Processes...\n');

// Patterns để tìm background processes
const backgroundPatterns = [
  {
    name: 'useUserInfo Calls',
    pattern: /useUserInfo\s*\(/g,
    severity: 'HIGH',
    cpuImpact: 3
  },
  {
    name: 'useBroadcastSync Calls',
    pattern: /useBroadcastSync\s*\(/g,
    severity: 'MEDIUM',
    cpuImpact: 2
  },
  {
    name: 'BroadcastChannel',
    pattern: /new\s+BroadcastChannel/g,
    severity: 'MEDIUM',
    cpuImpact: 2
  },
  {
    name: 'invalidateQueries',
    pattern: /invalidateQueries\s*\(/g,
    severity: 'MEDIUM',
    cpuImpact: 2
  },
  {
    name: 'setInterval',
    pattern: /setInterval\s*\(/g,
    severity: 'HIGH',
    cpuImpact: 4
  },
  {
    name: 'setTimeout',
    pattern: /setTimeout\s*\(/g,
    severity: 'LOW',
    cpuImpact: 1
  },
  {
    name: 'requestAnimationFrame',
    pattern: /requestAnimationFrame\s*\(/g,
    severity: 'HIGH',
    cpuImpact: 5
  },
  {
    name: 'WebSocket',
    pattern: /new\s+WebSocket/g,
    severity: 'MEDIUM',
    cpuImpact: 3
  },
  {
    name: 'addEventListener',
    pattern: /addEventListener\s*\(/g,
    severity: 'LOW',
    cpuImpact: 1
  },
  {
    name: 'useQuery (aggressive)',
    pattern: /refetchOnWindowFocus:\s*true/g,
    severity: 'HIGH',
    cpuImpact: 3
  },
  {
    name: 'useQuery (mount refetch)',
    pattern: /refetchOnMount:\s*true/g,
    severity: 'MEDIUM',
    cpuImpact: 2
  },
  {
    name: 'Polling Intervals',
    pattern: /refetchInterval:\s*\d+/g,
    severity: 'CRITICAL',
    cpuImpact: 6
  }
];

// Tìm tất cả files TypeScript/JavaScript
function findAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findAllFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.jsx')) {
      files.push({
        path: fullPath,
        relativePath: path.relative(process.cwd(), fullPath)
      });
    }
  }
  
  return files;
}

// Analyze files for background processes
function analyzeBackgroundProcesses(files) {
  const results = [];
  let totalCpuImpact = 0;
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const fileResults = [];
      
      backgroundPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          const count = matches.length;
          const impact = count * pattern.cpuImpact;
          totalCpuImpact += impact;
          
          fileResults.push({
            pattern: pattern.name,
            count: count,
            severity: pattern.severity,
            cpuImpact: impact
          });
        }
      });
      
      if (fileResults.length > 0) {
        results.push({
          file: file.relativePath,
          processes: fileResults,
          totalImpact: fileResults.reduce((sum, p) => sum + p.cpuImpact, 0)
        });
      }
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  return { results, totalCpuImpact };
}

// Main execution
try {
  const srcDir = path.join(process.cwd(), 'src');
  const files = findAllFiles(srcDir);
  const { results, totalCpuImpact } = analyzeBackgroundProcesses(files);
  
  console.log(`📊 Analysis Results (${files.length} files scanned):\n`);
  
  // Sort by CPU impact
  results.sort((a, b) => b.totalImpact - a.totalImpact);
  
  // Display top offenders
  console.log('🔥 TOP CPU OFFENDERS:\n');
  results.slice(0, 10).forEach((result, index) => {
    const severity = result.totalImpact > 15 ? '🔴' : 
                    result.totalImpact > 8 ? '🟠' : '🟡';
    
    console.log(`${severity} ${index + 1}. ${result.file} (${result.totalImpact}% CPU)`);
    result.processes.forEach(process => {
      const icon = process.severity === 'CRITICAL' ? '🚨' :
                   process.severity === 'HIGH' ? '⚠️' :
                   process.severity === 'MEDIUM' ? '⚡' : '💡';
      console.log(`   ${icon} ${process.pattern}: ${process.count} calls (${process.cpuImpact}% CPU)`);
    });
    console.log('');
  });
  
  // Summary by pattern
  console.log('📈 SUMMARY BY PATTERN:\n');
  const patternSummary = {};
  results.forEach(result => {
    result.processes.forEach(process => {
      if (!patternSummary[process.pattern]) {
        patternSummary[process.pattern] = { count: 0, impact: 0 };
      }
      patternSummary[process.pattern].count += process.count;
      patternSummary[process.pattern].impact += process.cpuImpact;
    });
  });
  
  Object.entries(patternSummary)
    .sort(([,a], [,b]) => b.impact - a.impact)
    .forEach(([pattern, data]) => {
      const severity = data.impact > 20 ? '🔴' : 
                      data.impact > 10 ? '🟠' : '🟡';
      console.log(`${severity} ${pattern}: ${data.count} calls (${data.impact}% CPU)`);
    });
  
  console.log('\n🎯 TOTAL ESTIMATED CPU IMPACT:', `${totalCpuImpact}%`);
  
  // Recommendations
  console.log('\n💡 IMMEDIATE ACTIONS:\n');
  
  if (patternSummary['useUserInfo Calls']?.impact > 10) {
    console.log('🔴 CRITICAL: Multiple useUserInfo calls detected');
    console.log('   → Implement UserContext to reduce from multiple calls to 1');
  }
  
  if (patternSummary['Polling Intervals']?.count > 0) {
    console.log('🔴 CRITICAL: Polling intervals detected');
    console.log('   → Disable refetchInterval in React Query');
  }
  
  if (patternSummary['requestAnimationFrame']?.count > 0) {
    console.log('🟠 HIGH: Animation loops detected');
    console.log('   → Disable performance monitoring components');
  }
  
  if (patternSummary['useBroadcastSync Calls']?.count > 0) {
    console.log('🟠 MEDIUM: BroadcastSync detected');
    console.log('   → Disable BroadcastChannel for testing');
  }
  
  console.log('\n🔧 Quick Fix Commands:');
  console.log('```javascript');
  console.log("localStorage.setItem('enableBroadcastSync', 'false');");
  console.log("localStorage.setItem('enablePerformanceStats', 'false');");
  console.log("localStorage.setItem('enableAnimations', 'false');");
  console.log('location.reload();');
  console.log('```');
  
  console.log('\n📊 Expected CPU Reduction:');
  console.log(`Current Impact: ${totalCpuImpact}%`);
  console.log(`After Fixes: ${Math.max(5, Math.round(totalCpuImpact * 0.2))}%`);
  console.log(`Reduction: ${Math.round(totalCpuImpact * 0.8)}%`);
  
} catch (error) {
  console.error('❌ Error analyzing files:', error.message);
}
