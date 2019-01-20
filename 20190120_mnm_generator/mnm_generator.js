const fs = require('fs');
const path = require('path');
const dirPath = {
    src: 'src',
    exclude: [
        'docs'
    ]
};
const packageJsonPath = 'package.json';
const dirFullPath = {};

// Define dirs' full path
const argSrcDirPath = process.argv[2];
dirFullPath.src = path.resolve(__dirname, (argSrcDirPath ? argSrcDirPath : dirPath.src));
const srcDirExists = fs.existsSync(dirFullPath.src) && fs.statSync(dirFullPath.src).isDirectory();
if (!srcDirExists) {
    throw new Error(`${dirFullPath.src} does not exist or is not a directory.`);
}
dirFullPath.exclude = dirPath.exclude.map(dirToExclude => path.resolve(dirFullPath.src, dirToExclude));

// Generate new mapper that maps <srcDir>/childrenDir
const currentDirFullPath = process.cwd();
const packageJsonFullPath = path.resolve(packageJsonPath);
const packageJson = JSON.parse(fs.readFileSync(packageJsonFullPath));
const newMNM = fs.readdirSync(dirFullPath.src).filter(filename => {
    const fileFullPath = path.resolve(dirFullPath.src, filename);
    return fs.statSync(fileFullPath).isDirectory() && !dirFullPath.exclude.includes(fileFullPath);
}).reduce((obj, dir) => {
    obj[`^${dir}/(.+)`] = `${dirFullPath.src.replace(currentDirFullPath, "<rootDir>")}/${dir}/$1`;
    return obj;
}, {});

// Delete existing mapper
Object.keys(packageJson.jest.moduleNameMapper).forEach(pattern => {
    const patternDuplicated = Object.keys(newMNM).includes(pattern);
    const patternExcluded = dirFullPath.exclude.some(fullPath => {
        return `^${fullPath.split('/').pop()}/(.+)` === pattern;
    })
    if (patternDuplicated || patternExcluded) {
        delete packageJson.jest.moduleNameMapper[pattern];
    }
});

// Merge mappers and write file, new mapper comes first
const moduleNameMapper = Object.assign(newMNM, packageJson.jest.moduleNameMapper);
packageJson.jest.moduleNameMapper = moduleNameMapper;
console.log(moduleNameMapper);
// fs.copyFileSync(packageJsonFullPath, `${packageJsonFullPath}.original`);
fs.writeFileSync(packageJsonFullPath, JSON.stringify(packageJson, null, 2));
