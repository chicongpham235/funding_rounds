yarn build

cd dist/

git init 
git add -A
git commit -m "deploy"
git push -f https://github.com/chicongpham235/fundraise-overview.git master:gh-pages