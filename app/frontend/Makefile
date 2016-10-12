build:
	npm install
	mkdir -p build
	cp -rf assets/* src/css build
	node_modules/.bin/webpack

build-dev:
	node_modules/.bin/webpack --watch --devtool source-map

.PHONY: build
