build:
	npm install
	mkdir -p build
	cp -rf assets/* src/css build
	node_modules/.bin/babel src/js --out-file build/app.js --source-maps

.PHONY: build
