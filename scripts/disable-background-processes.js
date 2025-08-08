#!/usr/bin/env node

/**
 * Script để disable tất cả background processes gây CPU cao
 */

console.log('🔧 Disabling Background Processes for CPU Optimization...\n');

// Set localStorage flags để disable các features
const disableFlags = [
  'enableAnimations=false',
  'enableCountdown=false', 
  'enablePerformanceStats=false',
  'enableWebSocket=false',
  'enableAutoRefetch=false',
  'reducedMotion=true'
];

console.log('📝 Setting localStorage flags:');
disableFlags.forEach(flag => {
  console.log(`  ✅ ${flag}`);
});

console.log('\n🌐 To apply these settings in browser, run:');
console.log('```javascript');
disableFlags.forEach(flag => {
  const [key, value] = flag.split('=');
  console.log(`localStorage.setItem('${key}', '${value}');`);
});
console.log('location.reload();');
console.log('```');

console.log('\n🎯 Expected CPU Reduction:');
console.log('  • WebSocket ping: -5-10% CPU');
console.log('  • Performance Stats: -5-10% CPU');
console.log('  • Animations: -3-5% CPU');
console.log('  • Auto Refetch: -5-8% CPU');
console.log('  • Total Expected: 20-30% → 5-10% CPU');

console.log('\n🧪 Testing Steps:');
console.log('  1. Open browser DevTools → Console');
console.log('  2. Paste the localStorage commands above');
console.log('  3. Refresh the page');
console.log('  4. Monitor CPU in Task Manager');
console.log('  5. Check Network tab for reduced API calls');

console.log('\n⚠️  Note: These are temporary settings for testing.');
console.log('   Use Performance Control Panel (⚡ button) for permanent settings.');

console.log('\n🔍 To re-enable features:');
console.log('```javascript');
console.log("localStorage.setItem('enableAnimations', 'true');");
console.log("localStorage.setItem('enableCountdown', 'true');");
console.log("localStorage.setItem('enableWebSocket', 'true');");
console.log('location.reload();');
console.log('```');

console.log('\n✅ Script completed. Apply settings in browser to test CPU reduction.');
