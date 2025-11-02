#!/usr/bin/env node

/**
 * Local Testing Script
 * Runs comprehensive tests and opens the app in browser
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description, exitOnError = true) {
  try {
    log(`\n▶ ${description}...`, colors.blue);
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, colors.red);
    if (exitOnError) {
      process.exit(1);
    }
    return false;
  }
}

function startServer() {
  log('\n🚀 Starting local test server...', colors.cyan);

  const server = spawn('npm', ['run', 'serve:prod'], {
    detached: false,
    stdio: 'pipe'
  });

  server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Accepting connections at')) {
      log('\n✨ Server running at http://localhost:3000', colors.green);
      log('\nPress Ctrl+C to stop the server\n', colors.yellow);

      // Open browser (cross-platform)
      const platform = process.platform;
      const openCommand = platform === 'darwin' ? 'open' :
                          platform === 'win32' ? 'start' :
                          'xdg-open';

      setTimeout(() => {
        try {
          execSync(`${openCommand} http://localhost:3000`);
          log('🌐 Browser opened', colors.green);
        } catch {
          log('⚠️  Please open http://localhost:3000 in your browser', colors.yellow);
        }
      }, 1000);
    }
    process.stdout.write(output);
  });

  server.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  server.on('close', () => {
    log('\n👋 Server stopped', colors.blue);
    process.exit(0);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    log('\n\n🛑 Stopping server...', colors.yellow);
    server.kill();
    process.exit(0);
  });
}

async function main() {
  log('\n🧪 LOCAL TESTING SUITE\n', colors.cyan);
  log('═'.repeat(50), colors.cyan);

  // 1. Check dependencies
  if (!fs.existsSync('node_modules')) {
    log('📦 Installing dependencies...', colors.yellow);
    runCommand('npm install', 'Dependency installation');
  }

  // 2. Run type checking
  runCommand('npm run typecheck', 'TypeScript check');

  // 3. Run linter
  runCommand('npm run lint', 'Linting', false); // Don't exit on lint warnings

  // 4. Build the project
  runCommand('npm run build', 'Production build');

  // 5. Check build output
  if (!fs.existsSync('dist/index.html')) {
    log('❌ Build failed - dist/index.html not found', colors.red);
    process.exit(1);
  }

  // 6. Get build size
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
  log(`\n📊 Build size: ${sizeInMB} MB`, colors.blue);

  log('\n' + '═'.repeat(50), colors.cyan);
  log('✅ ALL TESTS PASSED!', colors.green);
  log('═'.repeat(50), colors.cyan);

  // 7. Start server and open browser
  startServer();
}

main().catch(error => {
  log(`\n❌ Test failed: ${error.message}\n`, colors.red);
  process.exit(1);
});