const Parser = require('./parser')

module.exports = function (source) {
    // 设置可缓存标志的函数：调用此方法传递false以使加载器的结果不可缓存
    if (this.cacheable) {
        this.cacheable()
    }
    const options = this.getOptions()
    return new Parser(options).parse(source)
}
