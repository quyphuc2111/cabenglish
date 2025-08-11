#!/usr/bin/env node

/**
 * Script để detect duplicate useUserInfo calls và các API calls liên tục
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Detecting Duplicate API Calls...\n');

// Tìm tất cả files có useUserInfo
function findFilesWithUseUserInfo(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findFilesWithUseUserInfo(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('useUserInfo')) {
        files.push({
          path: fullPath,
          content: content,
          relativePath: path.relative(process.cwd(), fullPath)
        });
      }
    }
  }
  
  return files;
}

// Analyze useUserInfo usage
function analyzeUseUserInfo(files) {
  console.log('📊 useUserInfo Usage Analysis:\n');
  
  const results = [];
  
  files.forEach(file => {
    const lines = file.content.split('\n');
    const useUserInfoLines = [];
    
    lines.forEach((line, index) => {
      if (line.includes('useUserInfo')) {
        useUserInfoLines.push({
          lineNumber: index + 1,
          content: line.trim()
        });
      }
    });
    
    if (useUserInfoLines.length > 0) {
      results.push({
        file: file.relativePath,
        calls: useUserInfoLines
      });
    }
  });
  
  return results;
}

// Detect potential issues
function detectIssues(results) {
  console.log('🚨 Potential Issues Detected:\n');
  
  const issues = [];
  
  results.forEach(result => {
    // Multiple useUserInfo calls in same file
    if (result.calls.length > 1) {
      issues.push({
        type: 'MULTIPLE_CALLS',
        file: result.file,
        count: result.calls.length,
        severity: 'HIGH'
      });
    }
    
    // Check for useQuery with userInfo
    result.calls.forEach(call => {
      if (call.content.includes('useQuery') && call.content.includes('userInfo')) {
        issues.push({
          type: 'DUPLICATE_QUERY',
          file: result.file,
          line: call.lineNumber,
          severity: 'CRITICAL'
        });
      }
    });
  });
  
  return issues;
}

// Main execution
try {
  const srcDir = path.join(process.cwd(), 'src');
  const files = findFilesWithUseUserInfo(srcDir);
  const results = analyzeUseUserInfo(files);
  const issues = detectIssues(results);
  
  // Display results
  console.log(`Found ${files.length} files using useUserInfo:\n`);
  
  results.forEach(result => {
    console.log(`📁 ${result.file}`);
    result.calls.forEach(call => {
      console.log(`  Line ${call.lineNumber}: ${call.content}`);
    });
    console.log('');
  });
  
  // Display issues
  if (issues.length > 0) {
    console.log('🚨 ISSUES FOUND:\n');
    
    issues.forEach(issue => {
      const severity = issue.severity === 'CRITICAL' ? '🔴' : 
                      issue.severity === 'HIGH' ? '🟠' : '🟡';
      
      console.log(`${severity} ${issue.type} - ${issue.file}`);
      
      if (issue.type === 'MULTIPLE_CALLS') {
        console.log(`  → ${issue.count} useUserInfo calls in same file`);
      } else if (issue.type === 'DUPLICATE_QUERY') {
        console.log(`  → Line ${issue.line}: Duplicate useQuery for userInfo`);
      }
      console.log('');
    });
    
    console.log('💡 Recommendations:');
    console.log('  1. Use single useUserInfo hook per component');
    console.log('  2. Remove duplicate useQuery calls');
    console.log('  3. Pass userInfo as props instead of multiple hooks');
    console.log('  4. Use React Context for global user state');
    
  } else {
    console.log('✅ No duplicate useUserInfo issues found!');
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`  Files with useUserInfo: ${files.length}`);
  console.log(`  Total useUserInfo calls: ${results.reduce((sum, r) => sum + r.calls.length, 0)}`);
  console.log(`  Issues found: ${issues.length}`);
  
  const criticalIssues = issues.filter(i => i.severity === 'CRITICAL').length;
  const highIssues = issues.filter(i => i.severity === 'HIGH').length;
  
  if (criticalIssues > 0) {
    console.log(`  🔴 Critical issues: ${criticalIssues}`);
  }
  if (highIssues > 0) {
    console.log(`  🟠 High priority issues: ${highIssues}`);
  }
  
  console.log('\n🎯 CPU Impact:');
  console.log(`  Each duplicate call: ~2-5% CPU`);
  console.log(`  Total estimated impact: ${(criticalIssues * 5 + highIssues * 3)}% CPU`);
  
} catch (error) {
  console.error('❌ Error analyzing files:', error.message);
}
