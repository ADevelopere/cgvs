#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Download and run the nvm installation script
echo "🌎 Downloading nvm install script..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Activate nvm for the current session
#    This sources the nvm script into the shell.
echo "🚀 Activating nvm..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 3. Verify nvm installation
echo "🔍 Verifying nvm installation..."
command -v nvm

# 4. Install the latest LTS version of Node.js
echo "📦 Installing latest LTS version of Node.js..."
nvm install node

# 5. Set the LTS version as the default
nvm use node

# 6. Verify Node.js installation
echo "✅ Node.js version:"
node -v
echo "✅ npm version:"
npm -v

# 7. Node Path
echo "📁 Node.js is installed at:
nvm which node"


echo "🎉 All done! Node.js and nvm are installed."
echo "💡 Please restart your terminal or run 'source ~/.bashrc' (or ~/.zshrc) to use nvm."