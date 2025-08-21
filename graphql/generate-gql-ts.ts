import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertToConstName(name: string): string {
    // Convert the string to array of characters for easier processing
    const chars = name.split("");
    let result = chars[0].toUpperCase();

    // Process the rest of the string
    for (let i = 1; i < chars.length; i++) {
        const char = chars[i];
        const prevChar = chars[i - 1];

        // Check if current character is uppercase and not a number
        if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            // Only add underscore if:
            // 1. Previous character is lowercase, or
            // 2. Previous character is uppercase and next character is lowercase
            if (
                prevChar !== prevChar.toUpperCase() ||
                (i < chars.length - 1 &&
                    chars[i + 1] !== chars[i + 1].toUpperCase())
            ) {
                result += "_";
            }
            result += char;
        } else {
            result += char.toUpperCase();
        }
    }

    return result;
}

const storageKeywords = ["file", "folder", "upload", "storage"];
const authKeywords = ["auth", "login", "logout", "register", "me", "user"];

function getSubdirectory(operationName: string): string {
    const lowerCaseOperationName = operationName.toLowerCase();

    if (lowerCaseOperationName.includes("templatevariable")) {
        return "template-variable";
    }
    if (lowerCaseOperationName.includes("student")) {
        return "student";
    }
    if (lowerCaseOperationName.includes("templatecategory")) {
        return "template-category";
    }
    if (lowerCaseOperationName.includes("template")) {
        return "template";
    }
    if (
        storageKeywords.some((keyword) =>
            lowerCaseOperationName.includes(keyword)
        )
    ) {
        return "storage";
    }
    if (
        authKeywords.some((keyword) => lowerCaseOperationName.includes(keyword))
    ) {
        return "auth";
    }

    return "other";
}

function processGqlFile(filePath: string, outputDir: string) {
    const content = fs.readFileSync(filePath, "utf-8");

    // Extract the query/mutation name
    const match = content.match(/(?:query|mutation)\s+(\w+)/);
    if (!match) {
        console.error(`Could not find query/mutation name in ${filePath}`);
        return;
    }

    const operationName = match[1];
    const constName = convertToConstName(operationName);

    // Escape backticks in the content
    const escapedContent = content.replace(/`/g, "`");

    // Create the TypeScript content
    const tsContent = `import { gql } from '@apollo/client';

export const ${constName} = gql\`
${escapedContent}
\`;
`;

    // Create output directory structure
    const subdirectory = getSubdirectory(operationName);
    const outputSubDir = path.join(
        outputDir,
        path.basename(path.dirname(filePath)),
        subdirectory
    );
    const outputPath = path
        .join(outputSubDir, path.basename(filePath))
        .replace(".gql", ".ts");

    fs.mkdirSync(path.dirname(outputPath), {recursive: true});
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
        } else if (file.endsWith(".gql")) {
            processGqlFile(fullPath, outputDir);
        }
    }
}

// Get output directory from command line argument or use default
const args = process.argv.slice(2);
const outputDir = args[0] || path.join(__dirname, "generated", "gqlg-ts");

// Remove existing output directory
if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {recursive: true, force: true});
}

// Create output directory if it doesn't exist
fs.mkdirSync(outputDir, {recursive: true});

// Start processing from the gqlg directory
const inputDir = path.join(__dirname, "generated", "gqlg");
processDirectory(inputDir, outputDir);

console.log("Generation complete!");
