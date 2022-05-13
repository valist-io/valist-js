# Valist CLI

Valist command line interface.

<!-- toc -->
* [Valist CLI](#valist-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @valist/cli
$ valist COMMAND
running command...
$ valist (--version)
@valist/cli/2.1.0 darwin-arm64 node-v16.13.0
$ valist --help [COMMAND]
USAGE
  $ valist COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`valist download PACKAGE [OUTPUT]`](#valist-download-package-output)
* [`valist help [COMMAND]`](#valist-help-command)
* [`valist import PRIVATE-KEY`](#valist-import-private-key)
* [`valist publish PACKAGE FILES`](#valist-publish-package-files)

## `valist download PACKAGE [OUTPUT]`

Download a package.

```
USAGE
  $ valist download [PACKAGE] [OUTPUT] [--network <value>]

ARGUMENTS
  PACKAGE  package name
  OUTPUT   output path

FLAGS
  --network=<value>  [default: https://rpc.valist.io] Blockchain network

DESCRIPTION
  Download a package.

EXAMPLES
  $ valist download ipfs/go-ipfs/v0.12.2

  $ valist download ipfs/go-ipfs/v0.12.2 ~/Downloads/
```

_See code: [dist/commands/download.ts](https://github.com/valist-io/valist-js/blob/v2.1.0/dist/commands/download.ts)_

## `valist help [COMMAND]`

Display help for valist.

```
USAGE
  $ valist help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for valist.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `valist import PRIVATE-KEY`

Import a private key

```
USAGE
  $ valist import [PRIVATE-KEY]

ARGUMENTS
  PRIVATE-KEY  private key

DESCRIPTION
  Import a private key

EXAMPLES
  $ valist import 0xDEADBEEF
```

_See code: [dist/commands/import.ts](https://github.com/valist-io/valist-js/blob/v2.1.0/dist/commands/import.ts)_

## `valist publish PACKAGE FILES`

Publish a release

```
USAGE
  $ valist publish [PACKAGE] [FILES] [--meta-tx] [--network <value>] [--private-key <value>]

ARGUMENTS
  PACKAGE  package name
  FILES    files to publish

FLAGS
  --meta-tx              Enable meta transactions
  --network=<value>      [default: https://rpc.valist.io] Blockchain network
  --private-key=<value>  Account private key

DESCRIPTION
  Publish a release

EXAMPLES
  $ valist publish ipfs/go-ipfs/v0.12.3 src/**

  $ valist publish ipfs/go-ipfs/v0.12.3 dist/** docs/**
```

_See code: [dist/commands/publish.ts](https://github.com/valist-io/valist-js/blob/v2.1.0/dist/commands/publish.ts)_
<!-- commandsstop -->
