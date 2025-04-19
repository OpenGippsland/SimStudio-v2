#!/usr/bin/env node

/**
 * This script helps set up Supabase environment variables in Vercel
 * Run with: node setup-vercel-env.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Vercel CLI is not installed. Please install it with: npm i -g vercel');
  process.exit(1);
}

// Read environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    } else if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (error) {
  console.error('Error reading .env.local file:', error.message);
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Could not find Supabase URL or API key in .env.local file');
  process.exit(1);
}

console.log('\n=== Supabase Environment Variables ===');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey}`);
console.log('\nThese variables need to be set in your Vercel project settings.');

rl.question('\nDo you want to set these environment variables in Vercel now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      console.log('\nSetting environment variables in Vercel...');
      
      // Set Supabase URL
      execSync(`vercel env add NEXT_PUBLIC_SUPABASE_URL production`, { stdio: 'inherit' });
      
      // Set Supabase API key
      execSync(`vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production`, { stdio: 'inherit' });
      
      console.log('\nEnvironment variables have been set in Vercel.');
      console.log('You need to redeploy your project for the changes to take effect.');
      console.log('Run: vercel --prod');
    } catch (error) {
      console.error('Error setting environment variables:', error.message);
    }
  } else {
    console.log('\nYou can manually set these environment variables in the Vercel dashboard:');
    console.log('1. Go to your Vercel project');
    console.log('2. Navigate to Settings > Environment Variables');
    console.log('3. Add the following variables:');
    console.log(`   - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
    console.log(`   - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey}`);
    console.log('4. Redeploy your project');
  }
  
  rl.close();
});
