#!/bin/bash

set -e

echo "=========================================="
echo "Git Commit Squashing Script"
echo "=========================================="

# Set git config
git config user.name "ahmedhosnypro"
git config user.email "ahhosnyas@gmail.com"

echo "Current commit history (last 10):"
git log --oneline -10

echo ""
echo "Squashing related commits..."

# Reset to 10 commits back to start fresh
git reset --soft HEAD~10

# Create new consolidated commits
echo ""
echo "Creating consolidated commits..."

# Stage all changes
git add .

# Create consolidated commits based on logical groupings
git commit -m "feat: refactor components for mobile responsiveness and color props"

# Add font-related changes
git add .
git commit -m "feat: implement comprehensive font management system

- Add font family/variant structure with dialogs
- Auto-detect font metadata and variants  
- Implement font reference system with TypeScript enhancements
- Add font filtering and management utilities
- Include translations for font management UI"

# Add git script changes
git add scripts/fix-git-authors.sh
git commit -m "feat: add git author fix script with local config support"

echo ""
echo "New commit history:"
git log --oneline -5

echo ""
echo "Force pushing to remote..."
git push origin master --force

echo ""
echo "=========================================="
echo "SUCCESS! Commits have been squashed and pushed."
echo "=========================================="