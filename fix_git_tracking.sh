#!/bin/bash
# Remove all files from git index (but keep them on disk)
git rm -r --cached .

# Re-add all files (respecting .gitignore)
git add .

# Status check
echo "Git index cleaned. Please commit the changes now."
