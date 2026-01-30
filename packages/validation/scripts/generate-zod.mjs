import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const inputDir = './src/lib/schemas';
const outputDir = './src/lib/zod';
const indexFile = './src/lib/index.ts';

mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir)
  .filter((f) => extname(f) === '.json')
  .filter((f) => !basename(f).toLowerCase().includes('read'));

console.log(`🚀 Converting ${files.length} schemas to Zod...`);

const exportLines = ['// This file is generated, manual changes will be overwritten'];

/**
 * Convert a JSON Schema property to a Zod schema expression
 */
function generateZodProperty(prop, fieldName, isRequired) {
  let zodChain = '';

  // Handle different types
  if (Array.isArray(prop.type)) {
    // Union type (e.g., ["null", "string"])
    const types = prop.type.filter((t) => t !== 'null');
    const isNullable = prop.type.includes('null');

    if (types.length === 0) {
      zodChain = 'z.null()';
    } else if (types[0] === 'string') {
      zodChain = 'z.string()';
      if (prop.format === 'email') zodChain += '.email()';
      if (prop.format === 'uri') zodChain += '.url()';
      if (prop.format === 'date-time') zodChain += '.datetime()';
      if (prop.maxLength) zodChain += `.max(${prop.maxLength})`;
      if (isRequired) zodChain += '.min(1)';
      // For optional email/uri fields coming from forms, convert empty string to undefined before validation
      if (!isRequired && (prop.format === 'uri' || prop.format === 'email')) {
        // If nullable, preprocess must wrap the union so empty string becomes undefined before union parsing
        zodChain = `${zodChain}`; // keep inner schema in a temp value
        // mark that we'll wrap with preprocess after forming union if needed
        zodChain = `__PREPROCESS__${zodChain}`;
      }
    } else if (types[0] === 'integer') {
      zodChain = 'z.number().int()';
    } else if (types[0] === 'boolean') {
      zodChain = 'z.boolean()';
    } else if (types[0] === 'object') {
      zodChain = generateZodObject(prop.properties || {}, prop.required || []);
    }

    if (typeof zodChain === 'string' && zodChain.startsWith('__PREPROCESS__')) {
      const inner = zodChain.replace('__PREPROCESS__', '');
      // Build the inner schema first (union or plain)
      let innerSchema = isNullable ? `z.union([z.null(), ${inner}])` : `${inner}`;
      // If field is optional, apply .optional() to the inner schema so preprocess may return undefined
      if (!isRequired) innerSchema = `${innerSchema}.optional()`;
      zodChain = `z.preprocess((v) => v === '' ? undefined : v, ${innerSchema})`;
    } else {
      if (isNullable) zodChain = `z.union([z.null(), ${zodChain}])`;
      if (!isRequired) zodChain += '.optional()';
    }
  } else if (prop.type === 'string') {
    zodChain = 'z.string()';
    if (prop.format === 'email') zodChain += '.email()';
    if (prop.format === 'uri') zodChain += '.url()';
    if (prop.format === 'date-time') zodChain += '.datetime()';
    if (prop.maxLength) zodChain += `.max(${prop.maxLength})`;
    if (isRequired) zodChain += '.min(1)';
    // For optional email/uri fields coming from forms, convert empty string to undefined before validation
    if (!isRequired && (prop.format === 'uri' || prop.format === 'email')) {
      zodChain = `z.preprocess((v) => v === '' ? undefined : v, ${zodChain})`;
    }
    if (!isRequired) zodChain += '.optional()';
  } else if (prop.type === 'integer') {
    zodChain = 'z.number().int()';
    if (!isRequired) zodChain += '.optional()';
  } else if (prop.type === 'boolean') {
    zodChain = 'z.boolean()';
    if (!isRequired) zodChain += '.optional()';
  } else if (prop.type === 'object') {
    zodChain = generateZodObject(prop.properties || {}, prop.required || []);
    if (!isRequired) zodChain += '.optional()';
  } else if (prop.enum) {
    const enumValues = prop.enum.map((v) => `'${v}'`).join(', ');
    zodChain = `z.enum([${enumValues}])`;
    if (!isRequired) zodChain += '.optional()';
  } else {
    zodChain = 'z.unknown()';
    if (!isRequired) zodChain += '.optional()';
  }

  return zodChain;
}

/**
 * Generate a z.object(...) for a set of properties
 */
function generateZodObject(properties, requiredFields) {
  const lines = [];

  Object.entries(properties).forEach(([fieldName, prop]) => {
    const isRequired = requiredFields.includes(fieldName);
    const zodExpr = generateZodProperty(prop, fieldName, isRequired);
    lines.push(`  ${fieldName}: ${zodExpr},`);
  });

  return `z.object({\n${lines.join('\n')}\n})`;
}

/**
 * Generate TypeScript file for a single schema
 */
function generateSchema(inputPath, outputPath, variableName, typeName) {
  const jsonSchema = JSON.parse(readFileSync(inputPath, 'utf8'));
  const properties = jsonSchema.properties || {};
  const requiredFields = jsonSchema.required || [];

  const zodCode = generateZodObject(properties, requiredFields);

  const inferName = typeName.replace(/dto/gi, 'Input');

  const output = `import { z } from 'zod';

export const ${variableName} = ${zodCode};

export type ${inferName} = z.infer<typeof ${variableName}>;
`;

  writeFileSync(outputPath, output);
}

files.forEach((file) => {
  const inputPath = join(inputDir, file);
  const name = basename(file, '.json');
  const variableName =
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Schema';

  const typeName = variableName.replace('Schema', '');
  const outputPath = join(outputDir, `${name}.ts`);

  try {
    generateSchema(inputPath, outputPath, variableName, typeName);
    exportLines.push(`export * from './zod/${name}';`);
    console.log(`  ✅ Generated ${name}.ts`);
  } catch (err) {
    console.error(`  ❌ Failed to convert ${file}`);
    console.error(`     ${err.message}`);
  }
});

writeFileSync(indexFile, exportLines.join('\n'));
console.log(`✨ Updated index.ts with ${exportLines.length} exports`);
