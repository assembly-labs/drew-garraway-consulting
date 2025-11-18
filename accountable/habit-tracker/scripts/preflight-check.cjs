#!/usr/bin/env node

/**
 * Pre-flight check script
 * Validates the project is ready for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkExists(filePath, description) {
  const exists = fs.existsSync(path.join(process.cwd(), filePath));
  if (exists) {
    log(`✅ ${description}`, colors.green);
  } else {
    log(`❌ ${description} - File not found: ${filePath}`, colors.red);
  }
  return exists;
}

function runCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe' });
    log(`✅ ${description}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description}`, colors.red);
    if (error.stdout) {
      console.log(error.stdout.toString());
    }
    if (error.stderr) {
      console.log(error.stderr.toString());
    }
    return false;
  }
}

function checkPackageJson() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'zustand', 'framer-motion', 'date-fns'];

  let allDepsPresent = true;
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      log(`❌ Missing dependency: ${dep}`, colors.red);
      allDepsPresent = false;
    }
  });

  if (allDepsPresent) {
    log(`✅ All required dependencies present`, colors.green);
  }

  return allDepsPresent;
}

function checkBuildSize() {
  if (fs.existsSync('dist')) {
    const getDirectorySize = (dir) => {
      let size = 0;
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          size += getDirectorySize(filePath);
        } else {
          size += stats.size;
        }
      });
      return size;
    };

    const sizeInBytes = getDirectorySize('dist');
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

    if (sizeInMB < 10) {
      log(`✅ Build size: ${sizeInMB} MB (optimal)`, colors.green);
    } else if (sizeInMB < 20) {
      log(`⚠️  Build size: ${sizeInMB} MB (acceptable)`, colors.yellow);
    } else {
      log(`❌ Build size: ${sizeInMB} MB (too large)`, colors.red);
      return false;
    }
  }
  return true;
}

async function main() {
  log('\n🚀 PREFLIGHT CHECK - Habit Tracker\n', colors.cyan);

  let allChecksPassed = true;

  // 1. Check critical files
  log('📁 Checking critical files...', colors.blue);
  allChecksPassed &= checkExists('package.json', 'package.json exists');
  allChecksPassed &= checkExists('vite.config.ts', 'Vite config exists');
  allChecksPassed &= checkExists('tailwind.config.js', 'Tailwind config exists');
  allChecksPassed &= checkExists('tsconfig.app.json', 'TypeScript config exists');
  allChecksPassed &= checkExists('public/_redirects', 'Cloudflare redirects file exists');
  allChecksPassed &= checkExists('src/App.tsx', 'App.tsx exists');
  allChecksPassed &= checkExists('src/main.tsx', 'main.tsx exists');

  // 2. Check dependencies
  log('\n📦 Checking dependencies...', colors.blue);
  allChecksPassed &= checkPackageJson();

  // 3. TypeScript check
  log('\n🔍 Running TypeScript check...', colors.blue);
  allChecksPassed &= runCommand('npx tsc --noEmit', 'TypeScript compilation');

  // 4. Check if can build
  log('\n🏗️  Testing build process...', colors.blue);
  allChecksPassed &= runCommand('npm run build', 'Production build');

  // 5. Check build output
  log('\n📊 Checking build output...', colors.blue);
  allChecksPassed &= checkExists('dist/index.html', 'Build output exists');
  allChecksPassed &= checkBuildSize();

  // 6. Environment check
  log('\n🌍 Environment check...', colors.blue);
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  if (majorVersion >= 18) {
    log(`✅ Node version: ${nodeVersion}`, colors.green);
  } else {
    log(`⚠️  Node version: ${nodeVersion} (recommended: 18+)`, colors.yellow);
  }

  // Final result
  console.log('\n' + '='.repeat(50));
  if (allChecksPassed) {
    log('\n✅ ALL CHECKS PASSED - Ready for deployment!\n', colors.green);
    log('Next steps:', colors.cyan);
    log('  1. Test locally: npm run serve:prod', colors.reset);
    log('  2. Deploy to staging: npm run deploy:staging', colors.reset);
    log('  3. Deploy to production: npm run deploy:production', colors.reset);
    process.exit(0);
  } else {
    log('\n❌ PREFLIGHT FAILED - Fix issues before deploying\n', colors.red);
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Preflight check failed with error: ${error.message}\n`, colors.red);
  process.exit(1);
});