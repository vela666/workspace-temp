/*// 限制只能使用pnpm
console.log(process.env.npm_execpath)
if (!/pnpm/.test(process.env.npm_execpath || '')) {
    /!* console.warn(
         `\u001b[33mThis repository requires using pnpm as the package manager ` +
         ` for scripts to work properly.\u001b[39m\n`
     )*!/
    console.warn('请使用pnpm')
    // 结束进程
    process.exit(1)
}*/
if (!/pnpm/.test(process.env.npm_execpath || '')) {
    console.warn(`\u001b[33m请使用pnpm\u001b[39m\n`)
    process.exit(1)
}
