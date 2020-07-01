const BASE_URL = process.env.NODE_ENV === 'production' ? '/static/' : '/';
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}
console.log(BASE_URL,'____process.env.NODE_ENV___++__________________',process.env,)
module.exports = {
  publicPath: BASE_URL,
  // assetsPublicPath: '/',
  outputDir: '../static',
  productionSourceMap: false,
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  filenameHashing: true,
  // css: {
  //   extract: false, // 是否使用css分离插件 ExtractTextPlugin
  //   sourceMap: false, // 开启 CSS source maps
  //   loaderOptions: {}, // css预设器配置项
  //   modules: false // 启用 CSS modules for all css / pre-processor files.
  // },
  /* devServer: {
    port: 80
  }, */
  chainWebpack: config => {
    config.resolve.alias
    .set('@', resolve('src'))
    .set('@s', resolve('src/static')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    .set('@c', resolve('src/components'))
  },
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/api': {
        // 目标： 指向的网络地址
        target: 'https://plug.minibai.com/api/',
        secure: false,
        // webpack的属性，映射一个host
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}