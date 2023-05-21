// 脚本生成packages和子包以及加上前缀
// 文件移至根目录后控制台执行 node index.mjs "@monorepo.http|utils|web|server" // 字符串形如 前缀.子包1|子包2
import { promises } from 'fs'
import path from 'path'
import util from 'util'
import { exec } from 'child_process'

const execAsync = util.promisify(exec)
const [prefix, dirString] = process.argv[2].split('.')
let dirs = dirString.split('|')
const pkg = 'packages'
;(async () => {
    await promises.mkdir(pkg)
    dirs.forEach(async (i) => {
        const absPath = path.resolve(pkg, i)
        await promises.mkdir(absPath)
        const packageJson = path.resolve(absPath, 'package.json')
        await execAsync('pnpm init', { cwd: absPath })
        let file = await promises.readFile(packageJson, { encoding: 'utf-8' })
        const fileJson = JSON.parse(file)
        fileJson.name = `${prefix}/${fileJson.name}`
        await promises.writeFile(packageJson, JSON.stringify(fileJson, null, 4))
    })
})()
