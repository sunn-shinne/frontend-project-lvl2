install:
	npm ci

lint:
	npm eslint .

publish:
	npm publish --dry-run

gendiff:
	node bin/gendiff.js