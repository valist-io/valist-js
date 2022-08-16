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
@valist/cli/2.5.2 darwin-arm64 node-v16.13.0
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
* [`valist import`](#valist-import)
* [`valist install PACKAGE`](#valist-install-package)
* [`valist keygen`](#valist-keygen)
* [`valist publish [PACKAGE] [PATH]`](#valist-publish-package-path)

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

_See code: [dist/commands/download.ts](https://github.com/valist-io/valist-js/blob/v2.5.2/dist/commands/download.ts)_

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

## `valist import`

Import an account

```
USAGE
  $ valist import

DESCRIPTION
  Import an account

EXAMPLES
  $ valist import
```

_See code: [dist/commands/import.ts](https://github.com/valist-io/valist-js/blob/v2.5.2/dist/commands/import.ts)_

## `valist install PACKAGE`

Install a package

```
USAGE
  $ valist install [PACKAGE] [--network <value>]

ARGUMENTS
  PACKAGE  package name

FLAGS
  --network=<value>  [default: https://rpc.valist.io] Blockchain network

DESCRIPTION
  Install a package

EXAMPLES
  $ valist install ipfs/go-ipfs/v0.12.2
```

_See code: [dist/commands/install.ts](https://github.com/valist-io/valist-js/blob/v2.5.2/dist/commands/install.ts)_

## `valist keygen`

Generate a new account

```
USAGE
  $ valist keygen

DESCRIPTION
  Generate a new account

EXAMPLES
  $ valist keygen
```

_See code: [dist/commands/keygen.ts](https://github.com/valist-io/valist-js/blob/v2.5.2/dist/commands/keygen.ts)_

## `valist publish [PACKAGE] [PATH]`

Publish a release

```
USAGE
  $ valist publish [PACKAGE] [PATH] [--meta-tx] [--network <value>] [--private-key <value>]

ARGUMENTS
  PACKAGE  package name
  PATH     path to artifact file or directory

FLAGS
  --[no-]meta-tx         Enable meta transactions
  --network=<value>      [default: https://rpc.valist.io] Blockchain network
  --private-key=<value>  Account private key

DESCRIPTION
  Publish a release

EXAMPLES
  $ valist publish ipfs/go-ipfs/v0.12.3 README.md

  $ valist publish ipfs/go-ipfs/v0.12.3 dist/
```

_See code: [dist/commands/publish.ts](https://github.com/valist-io/valist-js/blob/v2.5.2/dist/commands/publish.ts)_
<!-- commandsstop -->
