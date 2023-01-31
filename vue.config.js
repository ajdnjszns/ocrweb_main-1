const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
    'vuex',
    'axios',
    'chart.js',
    'dayjs',
    'v-viewer',
    'vue-moment',
    'vue-momentjs',
    'vue-router',
    'vue-upload-component',
  ],
  configureWebpack: {
    entry: ['babel-polyfill', './src/main.js'],
  },

  devServer: {
    proxy: {
      '/ocr': {
        target: 'http://49.254.96.114:8080/Code1OcrWeb',
        changeOrigin: true,
      },
      '/output': {
        target: 'http://49.254.96.114:8080',
        changeOrigin: true,
      },
      '/code1-api': {
        target: 'http://49.254.96.114:8080',
        changeOrigin: true,
      },
      '/Code1OcrWeb': {
        target: 'http://49.254.96.114:8080',
        changeOrigin: true,
      },
    },
  },
});
