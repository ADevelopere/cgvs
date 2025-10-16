#!/bin/bash

# This script automates the installation of Oh My Zsh, a theme, plugins, and fonts.
# It is designed for Debian/Ubuntu-based systems but can be adapted.
# chmod +x ./scripts/install_ohmyzsh.sh && ./scripts/install_ohmyzsh.sh

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
wget -qO ~/.local/share/fonts/"MesloLGS NF Regular.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf
wget -qO ~/.local/share/fonts/"MesloLGS NF Bold.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf
wget -qO ~/.local/share/fonts/"MesloLGS NF Italic.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf
wget -qO ~/.local/share/fonts/"MesloLGS NF Bold Italic.ttf" https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf
# Refresh the font cache
fc-cache -f -v

# --- Step 4: Install Powerlevel10k Theme ---
echo "🎨 Step 4/7: Installing Powerlevel10k theme..."
ZSH_CUSTOM=${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM}/themes/powerlevel10k

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
        # Use a more robust sed command to add the plugin
        sed -i "s/plugins=(\([^)]*\))/plugins=(\1 ${plugin_name})/" "$zshrc_file"
        echo "  ✅ Added '$plugin_name' to plugins configuration"
    fi
}

# Install all plugins
install_plugin "zsh-autosuggestions" "https://github.com/zsh-users/zsh-autosuggestions.git"
install_plugin "zsh-syntax-highlighting" "https://github.com/zsh-users/zsh-syntax-highlighting.git"
install_plugin "fast-syntax-highlighting" "https://github.com/zdharma-continuum/fast-syntax-highlighting.git"
install_plugin "zsh-autocomplete" "https://github.com/marlonrichert/zsh-autocomplete.git"

# --- Step 6: Configure .zshrc ---
echo "📝 Step 6/7: Configuring .zshrc to enable theme and plugins..."
# Set ZSH_THEME to Powerlevel10k
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc

# Add all installed plugins to .zshrc configuration
echo "🔧 Configuring plugins in .zshrc..."
add_plugin_to_zshrc "zsh-autosuggestions"
add_plugin_to_zshrc "zsh-syntax-highlighting"
add_plugin_to_zshrc "fast-syntax-highlighting"
add_plugin_to_zshrc "zsh-autocomplete"

# --- Step 7: Set Zsh as Default Shell ---
echo "셸 Step 7/7: Setting Zsh as the default shell..."
if [ "$EUID" -eq 0 ]; then
    echo "  🔧 Running with sudo - changing default shell to zsh..."
    chsh -s $(which zsh)
    echo "  ✅ Default shell changed to zsh"
else
    echo "  ⚠️  Not running with sudo - skipping shell change"
    echo "  💡 To change your default shell, run: sudo chsh -s \$(which zsh)"
fi

# --- Final Instructions ---
echo ""
echo "✅ Installation Complete!"
echo ""
echo "#####################################################################"
echo "### ⚠️ IMPORTANT FINAL STEPS - PLEASE READ CAREFULLY ⚠️"
echo "#####################################################################"
echo ""
echo "1. **LOG OUT and LOG BACK IN** to your system for the shell change to take effect."
echo ""
echo "2. **CONFIGURE TERMINAL FONT**: Open your terminal's Preferences/Settings"
echo "   and change the font to 'MesloLGS NF'. This is REQUIRED for icons to display correctly."
echo ""
echo "3. **RUN THE CONFIGURATION WIZARD**: The first time you open the terminal after"
echo "   re-logging, the Powerlevel10k configuration wizard should start automatically."
echo "   If it does not, run it manually by typing:"
echo "   p10k configure"
echo ""
echo "#####################################################################"
echo ""