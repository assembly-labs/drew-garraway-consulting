#!/usr/bin/env node
/**
 * Franklin Hugh Money - Development Setup Script
 *
 * Sets up git hooks and development environment.
 *
 * Usage:
 *   npm run setup
 *   node scripts/setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.join(__dirname, '..', '..');
const FHM_DIR = path.join(__dirname, '..');
const HOOKS_SOURCE = path.join(__dirname, 'hooks');
const HOOKS_DEST = path.join(REPO_ROOT, '.git', 'hooks');

console.log('');
console.log('========================================');
console.log('  Franklin Hugh Money Setup');
console.log('========================================');
console.log('');

// Check if .git exists
if (!fs.existsSync(path.join(REPO_ROOT, '.git'))) {
    console.error('Error: Not in a git repository');
    process.exit(1);
}

// Ensure hooks directory exists
if (!fs.existsSync(HOOKS_DEST)) {
    fs.mkdirSync(HOOKS_DEST, { recursive: true });
}

// Install pre-commit hook
const preCommitSource = path.join(HOOKS_SOURCE, 'pre-commit');
const preCommitDest = path.join(HOOKS_DEST, 'pre-commit');

if (fs.existsSync(preCommitSource)) {
    console.log('Installing git hooks...');

    // Check if hook already exists
    if (fs.existsSync(preCommitDest)) {
        const existing = fs.readFileSync(preCommitDest, 'utf8');
        if (existing.includes('FHM Cache-Bust')) {
            console.log('  ✓ pre-commit hook already installed');
        } else {
            // Backup existing hook and append our hook
            console.log('  ! Existing pre-commit hook found');
            console.log('    Backing up to pre-commit.backup');
            fs.copyFileSync(preCommitDest, preCommitDest + '.backup');

            // Append our hook content
            const ourHook = fs.readFileSync(preCommitSource, 'utf8');
            const combined =
                existing + '\n\n# --- Franklin Hugh Money Cache-Bust Hook ---\n' + ourHook;
            fs.writeFileSync(preCommitDest, combined);
            fs.chmodSync(preCommitDest, '755');
            console.log('  ✓ pre-commit hook appended');
        }
    } else {
        // Copy our hook
        fs.copyFileSync(preCommitSource, preCommitDest);
        fs.chmodSync(preCommitDest, '755');
        console.log('  ✓ pre-commit hook installed');
    }
} else {
    console.log('  ! pre-commit hook source not found');
}

console.log('');
console.log('Setup complete!');
console.log('');
console.log('What was configured:');
console.log('  • Git pre-commit hook: Auto cache-busts when CSS/JS changes');
console.log('');
console.log('Available commands:');
console.log('  npm run dev          - Start local dev server');
console.log('  npm run cache-bust   - Manually run cache-busting');
console.log('  npm run build        - Build (runs cache-bust)');
console.log('  ./deploy.sh          - Deploy to production');
console.log('');
