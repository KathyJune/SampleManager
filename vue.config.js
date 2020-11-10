const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('src', resolve('src'))
      // .set('static', resolve('static'))
      .set('_c', resolve('src/components'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    port: 9620,
    proxy: {
      '/samplePreview': {
        target: 'http://192.168.1.198:8080',
        ws: true,
        changeOrigin: true,
        proxyTimeout: 10000,
        pathRewrite: {
          '^/samplePreview': '/'
        }
      },
      '/sampleDetail': {
        target: 'http://192.168.1.198:9019',
        ws: true,
        changeOrigin: true,
        proxyTimeout: 10000,
        pathRewrite: {
          '^/sampleDetail': '/'
        }
      },
      '/sampleSets': {
        target: 'http://192.168.1.198:9981',
        ws: true,
        changeOrigin: true,
        proxyTimeout: 10000,
        pathRewrite: {
          '^/sampleSets': '/'
        }
      },
      '/api': {
        target: 'http://192.168.1.152:9981',
        ws: true,
        changeOrigin: true,
        proxyTimeout: 10000,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/Service': {
        target: 'http://192.168.1.200:10080',
        changeOrigin: true,
        proxyTimeout: 10000,
        pathRewrite: {
          '^/Service': '/Service'
        }
      },
      '/singleService': {
        target: 'http://192.168.1.200:10081',
        changeOrigin: true,
        proxyTimeout: 10000,
        pathRewrite: {
          '^/singleService': '/Service'
        }
      }
    }
  }
}