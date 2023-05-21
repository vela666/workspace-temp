const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const {promises} = require("fs");
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
;(async () => {
    let getTargetDir = path.resolve(__dirname, '../packages')
    // 写入到根目录的package.json里
    const writeTargetDir = path.resolve(__dirname, '../package.json')
    let dirList = await readdir(getTargetDir)
    let rootDir = await readFile(writeTargetDir, {encoding: 'utf-8'})
    let data = JSON.parse(rootDir)
    let defaultScriptList = {
        "dev-desc1": "-r 递归当前目录中所有子目录 启动所有子项目的 dev 命令",
        "all:dev1": "pnpm -r --parallel dev",
        "dev-desc2": "启动所有子目录中package.json name有 vite的 dev命令",
        "all:dev2": "pnpm -r --parallel --filter \"*vite*\" dev",
        "all:build": "pnpm --parallel -r build",
        "inject-sub-startup-script": `node ./scripts/inject-sub-startup-script.js`,
        "preinstall": "node ./scripts/preinstall.js",
        // "preinstall": "npx only-allow pnpm"
    };
    dirList = dirList.reduce((p, item) => {
        p[`${item}:dev`] = `pnpm --filter ${item} dev`
        p[`${item}:build`] = `pnpm --filter ${item} build`
        return p
    }, {})
    data.scripts = {...data.scripts, ...defaultScriptList, ...dirList}
    fs.writeFile(writeTargetDir, JSON.stringify(data, "", "  "), {flag: 'w'}, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data added");
    });
})();
