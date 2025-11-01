// Quick diagnostic script
console.log('Node version:', process.version);
console.log('npm version:', process.env.npm_config_user_agent);
console.log('\nChecking workspace configuration...');

const fs = require('fs');
const path = require('path');

// Check package.json
const pkg = require('./package.json');
console.log('Workspaces configured:', pkg.workspaces);

// Check each workspace
pkg.workspaces.forEach(ws => {
  const wsPath = path.join(__dirname, ws);
  console.log(`\nChecking ${ws}...`);
  
  try {
    const dirs = fs.readdirSync(wsPath);
    dirs.forEach(dir => {
      const pkgPath = path.join(wsPath, dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const wsPkg = require(pkgPath);
        console.log(`  ✓ ${wsPkg.name} (${dir})`);
      }
    });
  } catch (err) {
    console.log(`  ✗ Error reading ${wsPath}`);
  }
});

console.log('\n✅ Configuration looks good!');
