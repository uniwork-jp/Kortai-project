#!/usr/bin/env node

/**
 * Windows-compatible wrapper for running orderUI dev server
 * This script handles Windows console encoding issues
 */

const { spawn } = require('child_process');
const path = require('path');

// Set encoding environment variables for Windows
process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --no-warnings';
process.env.FORCE_COLOR = '1';

const orderUIDir = path.join(__dirname, '..', 'apps', 'frontend', 'orderUI');

// Change to orderUI directory and run dev
const devProcess = spawn('pnpm', ['dev'], {
  cwd: orderUIDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Explicitly set UTF-8 encoding for Windows
    PYTHONIOENCODING: 'utf-8',
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US.UTF-8',
  }
});

devProcess.on('error', (error) => {
  console.error('Failed to start dev server:', error);
  process.exit(1);
});

devProcess.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle SIGINT and SIGTERM
process.on('SIGINT', () => {
  devProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  devProcess.kill('SIGTERM');
});

