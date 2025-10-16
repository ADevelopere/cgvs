#!/bin/sh

# 1. Run the official installer
echo "📦 Starting Bun installation..."
curl -fsSL https://bun.sh/install | bash

# 2. Define environment variables and the shell
BUN_INSTALL="$HOME/.bun"
SHELL_NAME=$(basename "$SHELL")

# 3. Detect the shell and determine the correct config file
case "$SHELL_NAME" in
  zsh)
    RC_FILE="$HOME/.zshrc"
    CONFIG_LINES="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
    ;;
  bash)
    RC_FILE="$HOME/.bashrc"
    CONFIG_LINES="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
    ;;
  fish)
    RC_FILE="$HOME/.config/fish/config.fish"
    CONFIG_LINES="\n# bun\nset -gx BUN_INSTALL \"\$HOME/.bun\"\nset -gx PATH \"\$BUN_INSTALL/bin\" \$PATH\n"
    ;;
  *)
    # Fallback for other shells like ksh, dash, etc.
    RC_FILE="$HOME/.profile"
    CONFIG_LINES="\n# bun\nexport BUN_INSTALL=\"\$HOME/.bun\"\nexport PATH=\"\$BUN_INSTALL/bin:\$PATH\"\n"
    echo "⚠️ Could not detect a specific shell, using '$RC_FILE' as a fallback."
    ;;
esac

# 4. Add the configuration to the shell's config file if it's not already there
if ! grep -q "BUN_INSTALL" "$RC_FILE"; then
  echo "🔧 Adding Bun to your PATH in $RC_FILE..."
  echo "$CONFIG_LINES" >> "$RC_FILE"
  echo "✅ Bun configuration added successfully."
else
  echo "👍 Bun configuration already exists in $RC_FILE."
fi

# 5. Provide final instructions
echo "\n🎉 Bun is installed!"
echo "To get started, run the following command or restart your terminal:"
echo "\n  source $RC_FILE\n"