SHELL=/bin/bash

all: install frontend cli

install:
	npm install

sdk:
	npm run build --workspace @valist/sdk

ui:
	npm run build --workspace @valist/ui

web:
	rm -rf ./packages/valist-web/out
	npm run build --workspace @valist/web
	npm run export --workspace @valist/web

cli:
	npm run build --workspace @valist/cli

electron: web
	npm run electron:sync
	npm run electron:open

electron-sign: web
	npm run electron:sync
	npm run electron:make --prefix=./electron

frontend: sdk ui web

dev:
	npm run dev

start: frontend
	npm run start --workspace @valist/web

lint:
	npm run lint

test:
	npm run test

clean:
	git clean -dfx

.PHONY: packages electron
