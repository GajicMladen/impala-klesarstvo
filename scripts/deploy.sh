#!/usr/bin/env bash
# Builds the site for GitHub Pages and force-pushes dist/ to the gh-pages branch of origin.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE="$(git remote get-url origin)"
npm run build:pages
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="deploy" -c user.email="deploy@users.noreply.github.com" commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f "$REMOTE" gh-pages:gh-pages
rm -rf .git
echo "Deployed to gh-pages."
