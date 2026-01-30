import { execSync } from 'node:child_process';
import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const inputDir = './src/lib/schemas';
const outputDir = './src/lib/zod';
const indexFile = './src/lib/index.ts';

// Ensure output dir exists
mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir)
  .filter((f) => extname(f) === '.json')
  .filter((f) => !basename(f).toLowerCase().includes('read'));
console.log(`🚀 Converting ${files.length} schemas to Zod...`);

const exportLines = [];

files.forEach((file) => {
  const inputPath = join(inputDir, file);
  const name = basename(file, '.json');
  // Convert kebab-case file name to PascalCase for the schema variable
  const variableName =
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Schema';

  const typeName = variableName.replace('Schema', '');
  const outputPath = join(outputDir, `${name}.ts`);

  try {
    // Generate the Zod schema
    // Note: --name parameter forces the exported variable name
    execSync(`npx json-schema-to-zod -i ${inputPath} -o ${outputPath} --name ${variableName}`);

    // Post-Process: Append the Type Inference
    const generatedCode = readFileSync(outputPath, 'utf8');
    const inferName = typeName.replace(/dto/gi, 'Input');
    const typeExport = `\nexport type ${inferName} = z.infer<typeof ${variableName}>;\n`;

    writeFileSync(outputPath, generatedCode + typeExport);

    exportLines.push(`export * from './zod/${name}';`);

    console.log(`  ✅ Generated ${name}.ts`);
  } catch (err) {
    console.error(`  ❌ Failed to convert ${file} - ${err}`);
  }
});

// Write the barrel file
writeFileSync(indexFile, exportLines.join('\n'));
console.log(`✨ Updated index.ts with ${exportLines.length} exports`);
