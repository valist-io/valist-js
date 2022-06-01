SHELL=/bin/bash

all: install frontend

install:
	npx lerna bootstrap

sdk:
	npm run build --prefix ./packages/valist-sdk

web:
	rm -rf ./packages/valist-web/out
	npm run build --prefix ./packages/valist-web
	npm run export --prefix ./packages/valist-web

frontend: sdk web

serve-frontend: sdk
	npm run start --prefix ./packages/valist-web

dev-sdk:
	npm run dev --prefix ./packages/valist-sdk

dev-web:
	npm run dev --prefix ./packages/valist-web

dev-frontend:
	$(MAKE) -j 2 dev-sdk dev-web

dev:
	$(MAKE) -j 3 up dev-sdk dev-web

lint-sdk:
	npm run lint --prefix ./packages/valist-sdk

lint-web:
	npm run lint --prefix ./packages/valist-web

lint-fix-sdk:
	npm run lint:fix --prefix ./packages/valist-sdk

lint-fix-web:
	npm run lint:fix --prefix ./packages/valist-web

lint: lint-sdk lint-web

lint-fix: lint-fix-sdk lint-fix-web

test:
	npx lerna run test

clean:
	git clean -dfx

.PHONY: packages
