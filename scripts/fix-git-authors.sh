#!/bin/bash

# Script to fix git author names and emails
# This will change all non-bot commits to use the correct author credentials

set -e

CORRECT_NAME="ahmedhosnypro"
CORRECT_EMAIL="ahhosnyas@gmail.com"

echo "=========================================="
echo "Git Author Fix Script"
echo "=========================================="
echo "This script will rewrite git history to change all author names/emails to:"
echo "  Name:  $CORRECT_NAME"
echo "  Email: $CORRECT_EMAIL"
echo ""
echo "ALL commits (including bots) will be changed."
echo ""
echo "WARNING: This will rewrite git history!"
echo "You will need to force push after this completes."
echo "=========================================="
echo ""

read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Setting up Git configuration..."
git config user.name "$CORRECT_NAME"
git config user.email "$CORRECT_EMAIL"
echo "✓ Git config updated:"
echo "  Name:  $(git config user.name)"
echo "  Email: $(git config user.email)"

echo ""
echo "Cleaning up previous filter-branch backups..."
rm -rf .git/refs/original/

echo ""
echo "Running git filter-branch to fix author names and emails..."
echo "This may take a few minutes..."
echo ""

export FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch -f --env-filter '
CORRECT_NAME="'"$CORRECT_NAME"'"
CORRECT_EMAIL="'"$CORRECT_EMAIL"'"

# Change ALL commits including bots to correct credentials
export GIT_AUTHOR_NAME="$CORRECT_NAME"
export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
export GIT_COMMITTER_NAME="$CORRECT_NAME"
export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
' --tag-name-filter cat -- --all

echo ""
echo "=========================================="
echo "Git history has been rewritten!"
echo "=========================================="
echo ""
echo "Verifying changes..."
echo ""
echo "Author names in repository:"
git log --all --format='%an' | sort | uniq -c | sort -rn
echo ""
echo "Author emails in repository:"
git log --all --format='%ae' | sort | uniq -c | sort -rn
echo ""
echo "=========================================="
echo "Next steps:"
echo "1. Review the changes above"
echo "2. Force push to GitHub: git push origin --all --force"
echo "3. If you have other branches, push them too"
echo "=========================================="

echo ""
echo "Attempting to force push to GitHub..."
echo ""

if git push origin master --force; then
    echo ""
    echo "✓ Successfully pushed master branch to GitHub!"
    echo ""
    
    # Try to push all branches if they exist
    if git branch -r | grep -v "origin/master" | grep -v "HEAD" > /dev/null 2>&1; then
        echo "Pushing all other branches..."
        git push origin --all --force
    fi
    
    echo ""
    echo "=========================================="
    echo "SUCCESS! All changes have been pushed to GitHub."
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo "ERROR: Failed to push to GitHub."
    echo "You may need to push manually:"
    echo "  git push origin master --force"
    echo "=========================================="
    exit 1
fi
