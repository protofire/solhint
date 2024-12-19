const { execSync } = require('child_process');

function changed() {
  try {
    // Run Git commands to check for changes in the lib/rules directory
    const diffIndex = execSync('git diff-index --name-only -B -R -M -C HEAD lib/rules').toString().trim();
    const lsFiles = execSync('git ls-files -t -o -m lib/rules').toString().trim();
    
    // Return true if there are changes
    return diffIndex !== '' || lsFiles !== '';
  } catch (error) {
    console.error('Error checking for changes:', error);
    return false;
  }
}

if (changed()) {
  try {
    // Run npm commands if there are changes
    execSync('npm run generate-rulesets', { stdio: 'inherit' });
    execSync('npm run docs', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running npm commands:', error);
    process.exit(1);
  }
} else {
  console.log('No changes detected in lib/rules.');
}