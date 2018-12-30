# Overview
This script allows a regression test for refactoring [IstanbulJS](https://github.com/istanbuljs/istanbuljs)'s code.

# How it works
This script takes a snapshot for html and json report then compares with a fresh coverage.

# Usage
Locate this script under project directory and just run.

```sh
$ node lib/refactor.js
```

# Environment
This scripts is verified under the project made as follows.

```sh
$ date
Sun Dec 30 03:37:58 JST 2018
$ create-react-app -V
2.1.2
$ create-react-app my-app
```