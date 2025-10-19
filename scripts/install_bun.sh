#!/bin/bash

# 1. Run the official installer
echo "📦 Starting Bun installation..."
curl -fsSL https://bun.sh/install | bash

# 2. Define environment variables
BUN_INSTALL="$HOME/.bun"

# 3. Define shell configuration files and their respective bun configurations
declare -A SHELL_CONFIGS=(
  ["$HOME/.zshrc"]="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
  ["$HOME/.bashrc"]="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
  ["$HOME/.bash_profile"]="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
  ["$HOME/.profile"]="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
  ["$HOME/.config/fish/config.fish"]="\n# bun\nset -gx BUN_INSTALL \"\$HOME/.bun\"\nset -gx PATH \"\$BUN_INSTALL/bin\" \$PATH\n"
)

# 4. Add bun configuration to all existing shell config files
echo "🔧 Adding Bun to your shell profiles..."

for config_file in "${!SHELL_CONFIGS[@]}"; do
  if [ -f "$config_file" ]; then
    if ! grep -q "BUN_INSTALL" "$config_file"; then
      echo "  Adding to $(basename "$config_file")..."
      echo -e "${SHELL_CONFIGS[$config_file]}" >> "$config_file"
    else
      echo "  Bun configuration already exists in $(basename "$config_file")."
    fi
  else
    echo "  $(basename "$config_file") not found, skipping..."
  fi
done

# 5. Create .profile if it doesn't exist (fallback for minimal systems)
if [ ! -f "$HOME/.profile" ]; then
  echo "  Creating $HOME/.profile as fallback..."
  echo -e "${SHELL_CONFIGS["$HOME/.profile"]}" > "$HOME/.profile"
fi

echo "✅ Bun configuration added to all available shell profiles."

# 6. Provide final instructions
echo "\n🎉 Bun is installed!"
echo "To get started, you can:"
echo "  1. Restart your terminal, or"
echo "  2. Run one of these commands to reload your shell configuration:"

# Check which shells are available and provide appropriate source commands
if command -v zsh >/dev/null 2>&1 && [ -f "$HOME/.zshrc" ]; then
  echo "    For zsh: source ~/.zshrc"
fi

if command -v bash >/dev/null 2>&1 && [ -f "$HOME/.bashrc" ]; then
  echo "    For bash: source ~/.bashrc"
fi

if command -v fish >/dev/null 2>&1 && [ -f "$HOME/.config/fish/config.fish" ]; then
  echo "    For fish: source ~/.config/fish/config.fish"
fi

if [ -f "$HOME/.profile" ]; then
  echo "    For other shells: source ~/.profile"
fi

echo ""
