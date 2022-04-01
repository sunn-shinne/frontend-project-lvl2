install:
	npm ci

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npx jest --coverage

publish:
	npm publish --dry-run

gendiff:
	node bin/gendiff.js