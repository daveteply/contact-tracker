import { execSync } from 'node:child_process';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const inputDir = './src/lib/schemas';
const outputDir = './src/lib/zod';

// 1. Ensure output dir exists
mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir).filter((f) => extname(f) === '.json');
console.log(`🚀 Converting ${files.length} schemas to Zod...`);

const exports = [];

files.forEach((file) => {
  const inputPath = join(inputDir, file);
  const name = basename(file, '.json');
  // Convert kebab-case file name to PascalCase for the schema variable
  const variableName =
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Schema';
  const outputPath = join(outputDir, `${name}.ts`);

  try {
    // Generate the Zod schema
    // Note: --name parameter forces the exported variable name
    execSync(`npx json-schema-to-zod -i ${inputPath} -o ${outputPath} --name ${variableName}`);

    exports.push(`export * from './zod/${name}';`);
    console.log(`  ✅ Generated ${name}.ts`);
  } catch (err) {
    console.error(`  ❌ Failed to convert ${file}`);
  }
});

// 2. Generate the index.ts entry point in src/lib/
const indexPath = './src/lib/index.ts';
const indexContent = `// --------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// --------------------------------------------------------------------------

${exports.join('\n')}
`;

writeFileSync(indexPath, indexContent);
console.log(`\n✨ Created index.ts with ${exports.length} exports.`);
