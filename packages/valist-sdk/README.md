# Valist SDK

This folder contains the Valist SDK/core library that bridges the IPFS and Ethereum networks.

## Documentation

For the TypeScript API documentation, please see the following link:

* [TypeScript API Docs](https://docs.valist.io/lib/classes/_index_.valist.html)

## Install

```shell
npm install --save @valist/sdk
```

## Usage

```typescript
import { Client, Contract, Storage } from '@valist/sdk';
import { ethers } from 'ethers';

// read-only
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new Contract.EVM('<valist-address>', provider);

// read-write
const signer = provider.getSigner();
const contract = new Contract.EVM('<valist-address>', signer)

const storage = new Storage.IPFS({host: 'https://pin.valist.io'});
const valist = new Client(contract, storage);

const team = valist.getTeam('valist');
const project = valist.getProject('valist', 'sdk');
const release = valist.getRelease('valist', 'sdk', 'latest');
```

## Building

```shell
npm run build
```

## Linting

```shell
npm run lint
```
