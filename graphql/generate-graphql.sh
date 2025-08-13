#!/bin/bash

# Set error handling
set -e

# Define paths
GRAPHQL_DIR="./generated"
SCHEMA_PATH="$GRAPHQL_DIR/schema.graphql"
GQLG_DIR="$GRAPHQL_DIR/gqlg"
GQLG_TS_DIR="$GRAPHQL_DIR/gqlg-ts"

echo "🚀 Starting GraphQL generation process..."
 
# Clean up directories
echo "🧹 Cleaning up generated directories..."
rm -rf "$GQLG_DIR" "$GQLG_TS_DIR"
mkdir -p "$GQLG_DIR" "$GQLG_TS_DIR"

# First codegen run
echo "⚙️ Running first codegen..."
bun run codegen

# bun install gql-generator -g
# Run gqlg
echo "📝 Generating GraphQL types..."
gqlg --schemaFilePath "$SCHEMA_PATH" --destDirPath "$GQLG_DIR"

# Generate TypeScript files
echo "🔄 Generating TypeScript files..."
bun run generate:gql-ts

# Second codegen run
echo "🔄 Running second codegen..."
bun run codegen

echo "✅ GraphQL generation completed successfully!"
