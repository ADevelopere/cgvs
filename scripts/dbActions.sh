#!/bin/zsh
# Interactive DB actions script for cgsvNew project



# List of actions and their corresponding bun commands
declare -A actions
actions=(
  ["Reset Database"]="bun run server/db/scripts/resetDb.ts"
  ["Seed Database"]="bun run server/db/scripts/drizzleSeed.ts"
  ["Generate Drizzle Schema"]="bun drizzle-kit generate"
  ["Run Migrations"]="bun run server/db/scripts/migrate.ts"
  ["Push Schema to DB"]="bun drizzle-kit push"
  ["Open Drizzle Studio"]="bun drizzle-kit studio"
)

# Get action names into an array
action_names=(${(k)actions})

# Use fzf for interactive selection (install if missing)
if ! command -v fzf &> /dev/null; then
  echo "fzf is required for interactive selection. Install it with:"
  echo "  sudo apt install fzf   # or: brew install fzf"
  exit 1
fi

selected=$(printf "%s\n" "${action_names[@]}" | fzf --prompt="Select DB action: " --height=10 --border)

if [[ -z "$selected" ]]; then
  echo "No action selected. Exiting."
  exit 0
fi

cmd=${actions[$selected]}
echo "Running: $cmd"

# Run the selected command
eval $cmd
