#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the public/puzzles directory
const puzzlesDir = path.join(process.cwd(), 'public', 'puzzles');

// Common image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

try {
  // Read all files in the puzzles directory
  const files = fs.readdirSync(puzzlesDir);
  console.log('Found files:', files);
  
  // Filter for image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
  
  console.log('Image files found:', imageFiles);
  
  // Create the data structure
  const puzzleData = {
    images: imageFiles,
    count: imageFiles.length,
    generatedAt: new Date().toISOString()
  };
  
  // Write to JSON file in public directory (served as static asset)
  const outputPath = path.join(process.cwd(), 'public', 'puzzle-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(puzzleData, null, 2));
  
  console.log(`✅ Generated puzzle-images.json with ${imageFiles.length} images`);
  console.log(`📁 Output: ${outputPath}`);
  
} catch (error) {
  console.error('❌ Error generating puzzle list:', error);
  process.exit(1);
}
