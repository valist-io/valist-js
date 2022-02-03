SHELL=/bin/bash

all: install frontend

install:
	npm i -g lerna
	lerna bootstrap

sdk:
	npm run build --prefix ./packages/valist-sdk

web:
	rm -rf ./packages/valist-web/out
	npm run build --prefix ./packages/valist-web
	npm run export --prefix ./packages/valist-web

frontend: sdk web

dev-sdk:
	npm run dev --prefix ./packages/valist-sdk

dev-web:
	npm run dev --prefix ./packages/valist-web

dev:
	$(MAKE) -j 3 up dev-sdk dev-web

up:
	docker-compose up

down:
	docker-compose down

bootstrap:
	npm run deploy:local --prefix ./packages/evm-contracts
	lerna run bootstrap

evm-build-subgraph:
	npm run codegen --prefix ./packages/evm-subgraph
	npm run build --prefix ./packages/evm-subgraph

evm-deploy-subgraph: evm-build-subgraph
	npm run deploy:local --prefix ./packages/evm-subgraph

evm-build-contracts:
	npm run export-abi --prefix ./packages/evm-contracts
	rm -Rf ./packages/valist-sdk/src/contract/abis
	rm -Rf ./packages/evm-subgraph/abis
	cp -R ./packages/evm-contracts/abis ./packages/valist-sdk/src/contract/abis
	cp -R ./packages/evm-contracts/artifacts/contracts ./packages/valist-sdk/src/contract/artifacts
	cp -R ./packages/evm-contracts/abis ./packages/evm-subgraph/abis

evm-deploy-contracts:
	npm run deploy:local --prefix ./packages/evm-contracts

evm-bootstrap:
	npm run bootstrap --prefix ./packages/evm-contracts

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

test-sdk:
	npm run test --prefix ./packages/valist-sdk

test: test-sdk

clean:
	rm -rf ./packages/valist-web/.next
	rm -rf ./packages/valist-web/out
	rm -rf ./packages/valist-web/node_modules
	rm -rf ./packages/valist-sdk/node_modules
	rm -rf ./packages/valist-sdk/dist
	rm -rf ./packages/evm-subgraph/data
	rm -rf dist

.PHONY: packages
