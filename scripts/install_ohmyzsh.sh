#!/bin/bash

# This script automates the installation of Oh My Zsh, a theme, plugins, and fonts.
# It is designed for Debian/Ubuntu-based systems but can be adapted.

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
echo "🔌 Step 5/7: Installing zsh-autosuggestions and zsh-syntax-highlighting plugins..."
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting

# --- Step 6: Configure .zshrc ---
echo "📝 Step 6/7: Configuring .zshrc to enable theme and plugins..."
# Set ZSH_THEME to Powerlevel10k
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc
# Add plugins to the plugins array
sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc

# --- Step 7: Set Zsh as Default Shell ---
echo "셸 Step 7/7: Setting Zsh as the default shell..."
chsh -s $(which zsh)

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