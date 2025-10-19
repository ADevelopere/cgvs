#!/bin/bash
# Interactive DB actions script for cgsvNew project

set -e

# List of actions in order and their corresponding bun commands
declare -a action_names=(
  "Reset Database"
  "Seed Database"
  "Generate Drizzle Schema"
  "Drop Drizzle Schema"
  "Run Migrations"
  "Push Schema to DB"
  "Open Drizzle Studio"
)

declare -A actions
actions=(
  ["Reset Database"]="bun run server/db/scripts/resetDb.ts"
  ["Seed Database"]="bun run server/db/scripts/drizzleSeed.ts"
  ["Generate Drizzle Schema"]="bun drizzle-kit generate"
  ["Drop Drizzle Schema"]="bun drizzle-kit drop"
  ["Run Migrations"]="bun run server/db/scripts/migrate.ts"
  ["Push Schema to DB"]="bun drizzle-kit push"
  ["Open Drizzle Studio"]="bun drizzle-kit studio"
)

# Use fzf for interactive selection (install if missing)
if ! command -v fzf &> /dev/null; then
  echo "fzf is required for interactive selection. Install it with:"
  echo "  sudo apt install fzf   # or: brew install fzf"
  exit 1
fi

while true; do
  selected=$(printf "%s\n" "${action_names[@]}" | fzf --prompt="Select DB action: " --height=10 --border)

  if [[ -z "$selected" ]]; then
    echo "No action selected. Exiting."
    exit 0
  fi

  cmd="${actions[$selected]}"

  if [[ -z "$cmd" ]]; then
    echo "Error: No command found for selected action."
    continue
  fi

  echo "Running: $cmd"
  echo ""

  # Run the selected command
  set +e  # Disable exit on error for the actual command
  bash -c "$cmd"
  exit_code=$?
  set -e  # Re-enable exit on error

  echo ""
  if [[ "$exit_code" -eq 0 ]]; then
    echo "✓ Command completed successfully"
  else
    echo "✗ Command failed with exit code: $exit_code"
  fi

  echo ""
  echo "Press Enter to continue or Ctrl+C to exit..."
  read -r
done
