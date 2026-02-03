#!/bin/bash
# Quick kanban update script
# Usage: ./update.sh "commit message"

cd /root/clawd/projects/kanban

# Update timestamp
sed -i "s/\"lastUpdated\": \".*\"/\"lastUpdated\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"/" data.json

# Commit and push
git add .
git commit -m "${1:-Update kanban}"
git push origin main

echo "✓ Pushed to GitHub Pages"
echo "  https://heysagehere.github.io/mission-control/"
