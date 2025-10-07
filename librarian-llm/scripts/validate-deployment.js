#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Running deployment validation...\n');

let errors = [];
let warnings = [];

// 1. Check API endpoint in frontend code
const hookFile = fs.readFileSync(
  path.join(projectRoot, 'src/hooks/useClaudeChat.ts'),
  'utf8'
);

if (hookFile.includes('/api/claude-chat')) {
  errors.push('❌ Frontend using wrong API endpoint. Should be /.netlify/functions/claude-chat');
} else if (hookFile.includes('/.netlify/functions/claude-chat')) {
  console.log('✅ API endpoint correct');
} else {
  warnings.push('⚠️  Could not verify API endpoint');
}

// 2. Check function export syntax
const functionFile = fs.readFileSync(
  path.join(projectRoot, 'netlify/functions/claude-chat.js'),
  'utf8'
);

if (functionFile.includes('export async function handler')) {
  console.log('✅ Function export syntax correct');
} else if (functionFile.includes('export const handler')) {
  errors.push('❌ Function uses wrong export syntax. Use: export async function handler()');
} else if (functionFile.includes('exports.handler')) {
  errors.push('❌ Function uses CommonJS. Convert to ES modules');
}

// 3. Check for netlify.toml conflicts
const hasNetlifyToml = fs.existsSync(path.join(projectRoot, 'netlify.toml'));
const hasRootNetlifyToml = fs.existsSync(path.join(projectRoot, '..', 'netlify.toml'));

if (hasNetlifyToml) {
  warnings.push('⚠️  netlify.toml found in project - may override dashboard settings');
}
if (hasRootNetlifyToml) {
  warnings.push('⚠️  netlify.toml found in repo root - may cause conflicts');
}

// 4. Check package.json type
const packageJson = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')
);

if (packageJson.type === 'module') {
  console.log('✅ package.json configured for ES modules');
} else {
  errors.push('❌ package.json missing "type": "module"');
}

// 5. Check model name
if (functionFile.includes('claude-3-haiku-20240307')) {
  console.log('✅ Using valid Claude model');
} else if (functionFile.includes('claude-3-5-sonnet')) {
  errors.push('❌ Using invalid model name. Use: claude-3-haiku-20240307');
}

// 6. Check environment variables
if (!fs.existsSync(path.join(projectRoot, '.env'))) {
  warnings.push('⚠️  No .env file for local testing');
} else {
  const envFile = fs.readFileSync(path.join(projectRoot, '.env'), 'utf8');
  if (!envFile.includes('CLAUDE_API_KEY') && !envFile.includes('claude_api_key')) {
    warnings.push('⚠️  .env missing API key for local testing');
  }
}

// Report results
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Ready to deploy.');
} else {
  if (errors.length > 0) {
    console.log('\n❌ ERRORS (must fix before deploying):');
    errors.forEach(e => console.log('  ' + e));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (review before deploying):');
    warnings.forEach(w => console.log('  ' + w));
  }
  if (errors.length > 0) {
    process.exit(1);
  }
}