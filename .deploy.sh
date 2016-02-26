#!/bin/bash
set -e
set -u
git config --global user.email 'keytester@cryptosense.com'
git config --global user.name 'Travis CI (keytester)'
git clone "https://$GH_TOKEN@github.com/cryptosense/keytester.git"
for f in index.html static/bundle.js ; do
    cp "$f" "keytester/$f"
done
cd keytester
git add .
git diff-index --quiet HEAD && exit 0
git commit -m "Deploy to gh-pages"
git push -f origin gh-pages
