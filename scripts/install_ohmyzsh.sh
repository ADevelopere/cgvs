#!/bin/bash

# This script automates the installation of Oh My Zsh, Powerlevel10k theme, plugins, and fonts.
# It also applies a pre-configured Powerlevel10k setup (if .p10k.zsh exists in the same directory).
# Designed for Debian/Ubuntu-based systems but can be adapted.
# Usage: chmod +x ./scripts/install_ohmyzsh.sh && ./scripts/install_ohmyzsh.sh

echo "🚀 Starting the ultimate Zsh setup..."

# --- Step 1: Install Prerequisites ---
echo "⚙️ Step 1/7: Installing prerequisites (zsh, git, curl, fontconfig)..."
# The '-y' flag assumes 'yes' to all prompts from the package manager.
sudo apt update
sudo apt install -y zsh git curl fontconfig

# --- Step 2: Install Oh My Zsh ---
if [ -d "$HOME/.oh-my-zsh" ]; then
  echo "✔️ Oh My Zsh is already installed. Skipping installation."
else
  echo "💻 Step 2/7: Installing Oh My Zsh..."
  # The '--unattended' flag prevents the installer from trying to change the shell.
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# --- Step 3: Install Fonts ---
echo "✒️ Step 3/7: Installing Powerlevel10k recommended fonts (MesloLGS NF)..."
# Create a local fonts directory if it doesn't exist
mkdir -p ~/.local/share/fonts
# Download the four font variants
echo "  📥 Downloading font files..."
wget -qO ~/.local/share/fonts/"MesloLGS NF Regular.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf
wget -qO ~/.local/share/fonts/"MesloLGS NF Bold.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf
wget -qO ~/.local/share/fonts/"MesloLGS NF Italic.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf
wget -qO ~/.local/share/fonts/"MesloLGS NF Bold Italic.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf
# Refresh the font cache
echo "  🔄 Refreshing font cache..."
fc-cache -f -v > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Fonts installed successfully"
else
    echo "  ⚠️  Font cache refresh failed, but fonts may still work"
fi

# --- Step 4: Install Powerlevel10k Theme ---
echo "🎨 Step 4/7: Installing Powerlevel10k theme..."
ZSH_CUSTOM=${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}
if [ -d "${ZSH_CUSTOM}/themes/powerlevel10k" ]; then
  echo "  ✔️ Powerlevel10k is already installed. Skipping installation."
else
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM}/themes/powerlevel10k
  if [ $? -eq 0 ]; then
    echo "  ✅ Successfully installed Powerlevel10k"
  else
    echo "  ❌ Failed to install Powerlevel10k"
    exit 1
  fi
fi

# --- Step 5: Install Plugins ---
echo "🔌 Step 5/7: Installing zsh plugins..."

# Function to install a plugin if it doesn't exist
install_plugin() {
    local plugin_name=$1
    local repo_url=$2
    local install_path="${ZSH_CUSTOM}/plugins/${plugin_name}"

    if [ -d "$install_path" ]; then
        echo "  ✔️ Plugin '$plugin_name' already installed, skipping..."
    else
        echo "  📦 Installing plugin '$plugin_name'..."
        git clone "$repo_url" "$install_path"
        if [ $? -eq 0 ]; then
            echo "  ✅ Successfully installed '$plugin_name'"
        else
            echo "  ❌ Failed to install '$plugin_name'"
            return 1
        fi
    fi
}

# Function to add plugin to .zshrc if not already present
add_plugin_to_zshrc() {
    local plugin_name=$1
    local zshrc_file="$HOME/.zshrc"

    # Check if plugin is already in the plugins array
    if grep -q "plugins=.*${plugin_name}" "$zshrc_file"; then
        echo "  ✔️ Plugin '$plugin_name' already configured in .zshrc"
    else
        echo "  📝 Adding '$plugin_name' to .zshrc plugins array..."
        
        # Check if the plugins=() pattern exists and is in the expected format
        if ! grep -q "^plugins=(" "$zshrc_file"; then
            echo "  ❌ ERROR: Could not find 'plugins=()' line in .zshrc"
            echo "  💡 Expected format: plugins=(git ...)"
            return 1
        fi
        
        # Create a backup before modification
        cp "$zshrc_file" "${zshrc_file}.backup"
        
        # Use a more robust sed command to add the plugin
        sed -i "s/plugins=(\([^)]*\))/plugins=(\1 ${plugin_name})/" "$zshrc_file"
        
        # Verify the change was applied
        if grep -q "plugins=.*${plugin_name}" "$zshrc_file"; then
            echo "  ✅ Added '$plugin_name' to plugins configuration"
            rm -f "${zshrc_file}.backup"
        else
            echo "  ❌ ERROR: Failed to add '$plugin_name' to plugins"
            echo "  🔄 Restoring backup..."
            mv "${zshrc_file}.backup" "$zshrc_file"
            return 1
        fi
    fi
}

# Install all plugins
install_plugin "zsh-autosuggestions" "https://github.com/zsh-users/zsh-autosuggestions.git"
install_plugin "zsh-syntax-highlighting" "https://github.com/zsh-users/zsh-syntax-highlighting.git"
install_plugin "fast-syntax-highlighting" "https://github.com/zdharma-continuum/fast-syntax-highlighting.git"
install_plugin "zsh-autocomplete" "https://github.com/marlonrichert/zsh-autocomplete.git"

# --- Step 6: Configure .zshrc ---
echo "📝 Step 6/7: Configuring .zshrc to enable theme and plugins..."

# Check if ZSH_THEME line exists in the expected format
if ! grep -q '^ZSH_THEME="' ~/.zshrc; then
    echo "  ❌ ERROR: Could not find ZSH_THEME line in .zshrc"
    echo "  💡 Expected format: ZSH_THEME=\"theme-name\""
    echo "  📄 Please manually set ZSH_THEME=\"powerlevel10k/powerlevel10k\" in ~/.zshrc"
    exit 1
fi

# Create a backup before modification
cp ~/.zshrc ~/.zshrc.backup

# Set ZSH_THEME to Powerlevel10k
sed -i 's/^ZSH_THEME="[^"]*"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc

# Verify the theme was changed successfully
if grep -q 'ZSH_THEME="powerlevel10k/powerlevel10k"' ~/.zshrc; then
    echo "  ✅ Theme successfully changed to Powerlevel10k"
    rm -f ~/.zshrc.backup
else
    echo "  ❌ ERROR: Theme change failed!"
    echo "  🔄 Restoring backup..."
    mv ~/.zshrc.backup ~/.zshrc
    echo "  💡 Please manually set ZSH_THEME=\"powerlevel10k/powerlevel10k\" in ~/.zshrc"
    exit 1
fi

# Add all installed plugins to .zshrc configuration
echo "🔧 Configuring plugins in .zshrc..."
PLUGIN_ERRORS=0

add_plugin_to_zshrc "zsh-autosuggestions" || PLUGIN_ERRORS=$((PLUGIN_ERRORS + 1))
add_plugin_to_zshrc "zsh-syntax-highlighting" || PLUGIN_ERRORS=$((PLUGIN_ERRORS + 1))
add_plugin_to_zshrc "fast-syntax-highlighting" || PLUGIN_ERRORS=$((PLUGIN_ERRORS + 1))
add_plugin_to_zshrc "zsh-autocomplete" || PLUGIN_ERRORS=$((PLUGIN_ERRORS + 1))

# Check if any plugin additions failed
if [ $PLUGIN_ERRORS -gt 0 ]; then
    echo ""
    echo "  ⚠️  WARNING: $PLUGIN_ERRORS plugin(s) failed to be added to .zshrc"
    echo "  💡 You can manually add them by editing ~/.zshrc"
    echo "  📝 Change the plugins line to:"
    echo "     plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete)"
    echo ""
fi

# Install Powerlevel10k configuration
echo "⚙️  Applying Powerlevel10k configuration..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
P10K_CONFIG="${SCRIPT_DIR}/.p10k.zsh"

if [ -f "$P10K_CONFIG" ]; then
    echo "  📋 Copying pre-configured .p10k.zsh..."
    cp "$P10K_CONFIG" ~/.p10k.zsh

    # Ensure p10k config is sourced in .zshrc
    if ! grep -q "source ~/.p10k.zsh" ~/.zshrc && ! grep -q '\[[ ! -f ~/.p10k.zsh \]\] || source ~/.p10k.zsh' ~/.zshrc; then
        echo "  📝 Adding p10k config to .zshrc..."
        echo "" >> ~/.zshrc
        echo "# To customize prompt, run \`p10k configure\` or edit ~/.p10k.zsh." >> ~/.zshrc
        echo "[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh" >> ~/.zshrc
    fi

    echo "  ✅ Powerlevel10k configuration applied successfully"
else
    echo "  ⚠️  Pre-configured .p10k.zsh not found at: $P10K_CONFIG"
    echo "  💡 You'll need to run 'p10k configure' manually after installation"
fi

# --- Step 7: Set Zsh as Default Shell ---
echo "🐚 Step 7/7: Setting Zsh as the default shell..."
# Try to change the default shell to zsh
if sudo chsh -s $(which zsh) $(whoami) 2>/dev/null; then
    echo "  ✅ Default shell changed to zsh"
else
    echo "  ⚠️  Could not change default shell automatically"
    echo "  💡 To change your default shell manually, run: sudo chsh -s \$(which zsh) \$(whoami)"
fi

# --- Final Instructions ---
echo ""
echo "✅ Installation Complete!"
echo ""
echo "#####################################################################"
echo "### ⚠️ IMPORTANT NEXT STEPS - PLEASE READ CAREFULLY ⚠️"
echo "#####################################################################"
echo ""
echo "To activate your new Zsh setup:"
echo ""
echo "1. **CLOSE THIS TERMINAL** completely and open a new terminal window"
echo "   OR run: exec zsh"
echo ""
echo "2. **CONFIGURE TERMINAL FONT** (if using a graphical terminal):"
echo "   Open terminal Preferences/Settings and set font to 'MesloLGS NF'"
echo "   This is REQUIRED for icons to display correctly."
echo ""
echo "3. **POWERLEVEL10K CONFIGURATION**:"
if [ -f "$P10K_CONFIG" ]; then
    echo "   ✅ Pre-configured theme has been applied automatically!"
    echo "   To customize, run: p10k configure"
else
    echo "   The Powerlevel10k wizard should start automatically."
    echo "   If not, manually run: p10k configure"
fi
echo ""
echo "Note: If p10k command is not found, ensure:"
echo "  - You're running zsh (check with: echo \$SHELL)"
echo "  - Powerlevel10k theme is set in ~/.zshrc"
echo "  - Source the config with: source ~/.zshrc"
echo ""
echo "#####################################################################"
echo ""
