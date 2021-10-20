SHELL=/bin/bash

all: install valist

valist: web

install: install-sdk install-app

install-sdk:
	npm install --prefix ./sdk

install-app:
	npm install --prefix ./app

sdk:
	npm run build --prefix ./sdk

app:
	rm -rf ./app/out
	npm run build --prefix ./app
	npm run export --prefix ./app

web: sdk app

start: sdk
	npm run start --prefix ./app

dev-sdk:
	npm run dev --prefix ./sdk

dev-app:
	npm run dev --prefix ./app

dev:
	@make -j 2 dev-sdk dev-app

lint-sdk:
	npm run lint --prefix ./sdk

lint-app:
	npm run lint --prefix ./app

lint-fix-sdk:
	npm run lint:fix --prefix ./sdk

lint-fix-app:
	npm run lint:fix --prefix ./app

lint: lint-sdk lint-app

lint-fix: lint-fix-sdk lint-fix-app

test-sdk:
	npm run test --prefix ./sdk

test: test-sdk

clean:
	rm -rf ./app/.next
	rm -rf ./app/out
	rm -rf ./app/node_modules
	rm -rf ./sdk/node_modules
	rm -rf ./sdk/dist
	rm -rf dist

.PHONY: app sdk
