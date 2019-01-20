# Overview
Detects children directories under source directory and add module name mapper to `jest.moduleNameMapper` in package.json.

# Background
When writing test you may import components like `import Component from 'src/Path/To/Compoent';` but may not want to write `src/` everytime as it is obvious. `jest.moduleNameMapper` solves this problem but if you have a lot of components it may be tough to write rules for them. Let it do automatically.

# How it works
This script detects directories under source directory **non-recursively** and adds module name mapper to package.json.

# Where to locate
Locate this script at project's root directory.

# Usage
## $ node mnm_generator.js [srcDir]
* `srcDir` source directory. **Default:** `src`

# Tips
To exclude directories edit code. It is specified in `dirPath.exclude` at [#L5](https://github.com/takubdm/__utility__/blob/master/20190120_mnm_generator/mnm_generator.js#L5).
