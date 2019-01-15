# Overview
Regression test for refactoring [IstanbulJS](https://github.com/istanbuljs/istanbuljs)'s code.

# How it works
This script takes a snapshot for html and json report then compares with fresh ones.

# Usage
Locate this script under project directory and just run.

```bash
$ node lib/refactor.js
```

# Environment
This script is verified under the project made as follows.

```bash
$ date
Sun Dec 30 03:37:58 JST 2018
$ create-react-app -V
2.1.2
$ create-react-app my-app
```