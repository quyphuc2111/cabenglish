#!/usr/bin/env node

/**
 * Script để tìm missing imports cho useUserInfo
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Finding Missing useUserInfo Imports...\n');

// Tìm tất cả files TypeScript/React
function findAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findAllFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push({
        path: fullPath,
        relativePath: path.relative(process.cwd(), fullPath)
      });
    }
  }
  
  return files;
}

// Check for missing useUserInfo imports
function checkMissingImports(files) {
  const issues = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const lines = content.split('\n');
      
      // Check if file uses useUserInfo
      const hasUseUserInfo = content.includes('useUserInfo(');
      
      if (hasUseUserInfo) {
        // Check if it has import
        const hasImport = content.includes('import') && 
                         (content.includes('useUserInfo') && 
                          (content.includes('from "@/hooks/useUserInfo"') || 
                           content.includes("from '@/hooks/useUserInfo'")));
        
        if (!hasImport) {
          // Find lines with useUserInfo usage
          const usageLines = [];
          lines.forEach((line, index) => {
            if (line.includes('useUserInfo(')) {
              usageLines.push({
                lineNumber: index + 1,
                content: line.trim()
              });
            }
          });
          
          issues.push({
            file: file.relativePath,
            type: 'MISSING_IMPORT',
            usageLines: usageLines,
            severity: 'CRITICAL'
          });
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  return issues;
}

// Main execution
try {
  const srcDir = path.join(process.cwd(), 'src');
  const files = findAllFiles(srcDir);
  const issues = checkMissingImports(files);
  
  console.log(`📊 Analyzed ${files.length} files\n`);
  
  if (issues.length > 0) {
    console.log('🚨 MISSING IMPORTS FOUND:\n');
    
    issues.forEach((issue, index) => {
      console.log(`🔴 ${index + 1}. ${issue.file}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Severity: ${issue.severity}`);
      console.log(`   Usage lines:`);
      
      issue.usageLines.forEach(usage => {
        console.log(`     Line ${usage.lineNumber}: ${usage.content}`);
      });
      
      console.log(`   🔧 Fix: Add this import at the top:`);
      console.log(`     import { useUserInfo } from '@/hooks/useUserInfo';`);
      console.log('');
    });
    
    console.log('💡 Quick Fix Commands:\n');
    
    issues.forEach(issue => {
      console.log(`# Fix ${issue.file}`);
      console.log(`echo "import { useUserInfo } from '@/hooks/useUserInfo';" | cat - "${issue.file}" > temp && mv temp "${issue.file}"`);
    });
    
    console.log('\n🎯 Summary:');
    console.log(`  Files with missing imports: ${issues.length}`);
    console.log(`  Total usage lines: ${issues.reduce((sum, issue) => sum + issue.usageLines.length, 0)}`);
    
  } else {
    console.log('✅ No missing useUserInfo imports found!');
    console.log('All files that use useUserInfo have proper imports.');
  }
  
  console.log('\n🔍 Additional Checks:');
  console.log('  - Check for typos in import paths');
  console.log('  - Verify useUserInfo hook exists');
  console.log('  - Check for circular dependencies');
  
} catch (error) {
  console.error('❌ Error analyzing files:', error.message);
}
