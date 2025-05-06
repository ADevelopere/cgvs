import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertToConstName(name: string): string {
    // First character should be uppercase without underscore
    let result = name.charAt(0).toUpperCase();
    
    // Process the rest of the string
    for (let i = 1; i < name.length; i++) {
        const char = name.charAt(i);
        if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            // If it's an uppercase letter, add underscore before it
            result += '_' + char;
        } else {
            result += char.toUpperCase();
        }
    }
    
    return result;
}

function processGqlFile(filePath: string, outputDir: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the query/mutation name
    const match = content.match(/(?:query|mutation)\s+(\w+)/);
    if (!match) {
        console.error(`Could not find query/mutation name in ${filePath}`);
        return;
    }
    
    const operationName = match[1];
    const constName = convertToConstName(operationName);
    
    // Create the TypeScript content
    const tsContent = `import { gql } from '@apollo/client';

export const ${constName} = gql\`
${content}
\`;
`;
    
    // Create output directory structure
    const relativePath = path.relative(path.join(__dirname, '..', 'graphql-generated', 'gqlg'), filePath);
    const outputPath = path.join(outputDir, relativePath).replace('.gql', '.ts');
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`Generated: ${outputPath}`);
}

function processDirectory(dir: string, outputDir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath, outputDir);
        } else if (file.endsWith('.gql')) {
            processGqlFile(fullPath, outputDir);
        }
    }
}

// Get output directory from command line argument or use default
const args = process.argv.slice(2);
const outputDir = args[0] || path.join(__dirname, '..', 'graphql-generated', 'gqlg-ts');

// Create output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

// Start processing from the gqlg directory
const inputDir = path.join(__dirname, '..', 'graphql-generated', 'gqlg');
processDirectory(inputDir, outputDir);

console.log('Generation complete!');
