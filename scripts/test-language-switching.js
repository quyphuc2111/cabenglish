#!/usr/bin/env node

/**
 * Script để test chức năng chuyển ngôn ngữ
 * Kiểm tra các file đã được cập nhật đúng chưa
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Language Switching Implementation...\n');

const filesToCheck = [
  {
    path: 'src/hooks/useTranslation.ts',
    checks: [
      { pattern: /useTranslations.*from.*TranslationContext/, description: 'Import TranslationContext' },
      { pattern: /determineLanguage.*useCallback/, description: 'Language determination logic' },
      { pattern: /contextTranslations\.t\(key\)/, description: 'Server-side fallback' },
      { pattern: /currentLanguage: currentLang,[\s\S]*ready:/, description: 'Return enhanced object' }
    ]
  },
  {
    path: 'src/components/admin-panel/navbar-com/LanguageSwitcher.tsx',
    checks: [
      { pattern: /getCurrentLanguage.*useCallback/, description: 'Language getter function' },
      { pattern: /isChangingRef\.current.*isPending/, description: 'Prevent double clicks' },
      { pattern: /await.*i18next\.changeLanguage/, description: 'Async language change' },
      { pattern: /await update\(\{[\s\S]*language: newLang/, description: 'Session update' },
      { pattern: /searchParams\.set.*lang/, description: 'URL params handling' }
    ]
  },
  {
    path: 'src/components/context/TranslationContext.tsx',
    checks: [
      { pattern: /interface.*TranslationContextType/, description: 'TypeScript interface' },
      { pattern: /currentLanguage.*string/, description: 'Language tracking' },
      { pattern: /const contextValue = useMemo/, description: 'Memoized context value' }
    ]
  },
  {
    path: 'src/middleware.ts',
    checks: [
      { pattern: /handleLocale.*token/, description: 'Token parameter added' },
      { pattern: /const userLang = token\?\.language/, description: 'User language from token' },
      { pattern: /finalLang.*userLang.*validLocales/, description: 'Priority logic' }
    ]
  },
  {
    path: 'src/providers/providers.tsx',
    checks: [
      { pattern: /currentLanguage.*string/, description: 'Language prop' },
      { pattern: /currentLanguage=\{currentLanguage\}/, description: 'Pass language to provider' }
    ]
  }
];

let allPassed = true;
let totalChecks = 0;
let passedChecks = 0;

filesToCheck.forEach(file => {
  console.log(`📁 Checking ${file.path}:`);
  
  try {
    const content = fs.readFileSync(file.path, 'utf8');
    
    file.checks.forEach(check => {
      totalChecks++;
      const passed = check.pattern.test(content);
      
      if (passed) {
        console.log(`  ✅ ${check.description}`);
        passedChecks++;
      } else {
        console.log(`  ❌ ${check.description}`);
        allPassed = false;
      }
    });
    
  } catch (error) {
    console.log(`  ❌ File not found or readable: ${error.message}`);
    allPassed = false;
  }
  
  console.log('');
});

// Summary
console.log('📊 Test Summary:');
console.log(`  Total checks: ${totalChecks}`);
console.log(`  Passed: ${passedChecks}`);
console.log(`  Failed: ${totalChecks - passedChecks}`);
console.log(`  Success rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (allPassed) {
  console.log('\n🎉 All tests passed! Language switching should work correctly.');
  console.log('\n📋 Next steps:');
  console.log('  1. Start the development server: npm run dev');
  console.log('  2. Test language switching in the UI');
  console.log('  3. Check browser console for any errors');
  console.log('  4. Verify translations update correctly');
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.');
  console.log('\n🔧 Common issues:');
  console.log('  - Missing imports');
  console.log('  - Incorrect function signatures');
  console.log('  - Missing TypeScript types');
}

console.log('\n🧪 Manual Testing Checklist:');
console.log('  □ Language switcher appears in navbar');
console.log('  □ Clicking switcher changes language immediately');
console.log('  □ URL updates with ?lang= parameter');
console.log('  □ Page content translates correctly');
console.log('  □ Language persists after page refresh');
console.log('  □ User language saves to database');
console.log('  □ No console errors during switching');
